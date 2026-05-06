import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Message from "./models/Message.js";
import Conversation from "./models/Conversation.js";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface ConnectedUsers {
  [userId: string]: string; // userId → socketId
}

// ─────────────────────────────────────────────
// State
// ─────────────────────────────────────────────
let io: Server;
const connectedUsers: ConnectedUsers = {};

// ─────────────────────────────────────────────
// Init
// ─────────────────────────────────────────────
export function initializeSocket(httpServer: HttpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: function (origin, callback) {
        if (
          !origin ||
          /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
        ) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  // ── Auth middleware ──
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers.authorization?.split(" ")[1];

      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      const secret = process.env.JWT_SECRET || "replace_with_strong_secret";
      const decoded = jwt.verify(token, secret) as { userId: string };
      socket.data.userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  // ── Connection handler ──
  io.on("connection", (socket: Socket) => {
    const userId = socket.data.userId as string;
    console.log(`[Socket] Connected: ${userId} (${socket.id})`);

    // 1. Đăng ký user online
    connectedUsers[userId] = socket.id;

    // 2. Khi user vừa kết nối → cập nhật deliveredAt cho tất cả tin
    //    chưa deliver trong khi họ offline
    _flushPendingDeliveries(userId);

    // ── Typing ──────────────────────────────────
    socket.on(
      "typing",
      (data: { conversationId: string; receiverId: string }) => {
        const receiverSocketId = connectedUsers[data.receiverId];
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("typing", {
            senderId: userId,
            conversationId: data.conversationId,
          });
        }
      },
    );

    socket.on(
      "stopTyping",
      (data: { conversationId: string; receiverId: string }) => {
        const receiverSocketId = connectedUsers[data.receiverId];
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("stopTyping", {
            senderId: userId,
            conversationId: data.conversationId,
          });
        }
      },
    );

    // ── Join conversation room ───────────────────
    // FE gọi khi mở màn hình chat, giúp broadcast theo room thay vì
    // phải tra socketId của từng người.
    socket.on(
      "joinConversation",
      async (
        data: { conversationId: string },
        callback?: (ok: boolean) => void,
      ) => {
        try {
          if (!mongoose.Types.ObjectId.isValid(data.conversationId)) {
            callback?.(false);
            return;
          }

          // Kiểm tra user có quyền vào room này không
          const conv = await Conversation.findOne({
            _id: data.conversationId,
            participants: new mongoose.Types.ObjectId(userId),
          });

          if (!conv) {
            callback?.(false);
            return;
          }

          socket.join(data.conversationId);
          console.log(`[Socket] ${userId} joined room ${data.conversationId}`);
          callback?.(true);
        } catch (err) {
          console.error("[Socket] joinConversation error:", err);
          callback?.(false);
        }
      },
    );

    socket.on("leaveConversation", (data: { conversationId: string }) => {
      socket.leave(data.conversationId);
    });

    // ── Mark as read (qua socket thay vì REST) ───
    // FE có thể gọi REST PATCH hoặc socket event này — cả 2 đều OK.
    // Dùng socket khi muốn real-time không cần roundtrip HTTP.
    socket.on(
      "markAsRead",
      async (
        data: { conversationId: string },
        callback?: (ok: boolean) => void,
      ) => {
        try {
          if (!mongoose.Types.ObjectId.isValid(data.conversationId)) {
            callback?.(false);
            return;
          }

          const conversation = await Conversation.findOne({
            _id: data.conversationId,
            participants: new mongoose.Types.ObjectId(userId),
          });

          if (!conversation) {
            callback?.(false);
            return;
          }

          const now = new Date();

          // Đánh dấu đã đọc tất cả tin chưa đọc của mình
          await Message.updateMany(
            {
              conversationId: data.conversationId,
              receiver: new mongoose.Types.ObjectId(userId),
              readAt: null,
            },
            { $set: { readAt: now } },
          );

          // Reset unread counter
          await Conversation.findByIdAndUpdate(data.conversationId, {
            $set: { [`unreadCount.${userId}`]: 0 },
          });

          // Thông báo cho đối phương biết tin đã được đọc
          const partnerId = conversation.participants
            .find((p) => p.toString() !== userId)
            ?.toString();

          if (partnerId) {
            const partnerSocketId = connectedUsers[partnerId];
            if (partnerSocketId) {
              io.to(partnerSocketId).emit("messagesRead", {
                conversationId: data.conversationId,
                readBy: userId,
                readAt: now,
              });
            }
          }

          callback?.(true);
        } catch (err) {
          console.error("[Socket] markAsRead error:", err);
          callback?.(false);
        }
      },
    );

    // ── Disconnect ───────────────────────────────
    socket.on("disconnect", () => {
      console.log(`[Socket] Disconnected: ${userId}`);
      delete connectedUsers[userId];
    });
  });

  return io;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/**
 * Khi user kết nối lại, đánh dấu deliveredAt cho những tin nhắn
 * đã gửi cho họ trong khi offline (deliveredAt = null).
 */
async function _flushPendingDeliveries(userId: string): Promise<void> {
  try {
    const result = await Message.updateMany(
      {
        receiver: new mongoose.Types.ObjectId(userId),
        deliveredAt: null,
      },
      { $set: { deliveredAt: new Date() } },
    );

    if (result.modifiedCount > 0) {
      // Lấy danh sách tin vừa deliver để thông báo sender
      const deliveredMessages = await Message.find(
        {
          receiver: new mongoose.Types.ObjectId(userId),
          deliveredAt: { $exists: true, $ne: null },
          readAt: null,
        },
        { conversationId: 1, sender: 1, _id: 1 },
      ).limit(50);

      // Group theo sender để giảm số emit
      const bySender: Record<string, string[]> = {};
      for (const msg of deliveredMessages) {
        const senderId = msg.sender.toString();
        if (!bySender[senderId]) bySender[senderId] = [];
        bySender[senderId].push(msg._id.toString());
      }

      for (const [senderId, messageIds] of Object.entries(bySender)) {
        const senderSocketId = connectedUsers[senderId];
        if (senderSocketId) {
          io.to(senderSocketId).emit("messagesDelivered", {
            receiverId: userId,
            messageIds,
          });
        }
      }
    }
  } catch (err) {
    console.error("[Socket] _flushPendingDeliveries error:", err);
  }
}

// ─────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────
export function getReceiverSocketId(userId: string): string | undefined {
  return connectedUsers[userId];
}

export function getIo(): Server {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
}
