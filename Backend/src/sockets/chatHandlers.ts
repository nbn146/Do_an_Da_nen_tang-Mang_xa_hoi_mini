import mongoose from "mongoose";
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import { getIo, getReceiverSocketId } from "./state.js";
import type {
  AuthenticatedSocket,
  ConversationPayload,
  TypingPayload,
} from "./types.js";

// ─────────────────────────────────────────────
// Chat handlers: typing, join/leave room, markAsRead
// ─────────────────────────────────────────────

/** Đăng ký tất cả event liên quan đến chat cho 1 socket */
export function registerChatHandlers(socket: AuthenticatedSocket): void {
  const userId = socket.data.userId;
  const io = getIo();

  // ── Typing ──────────────────────────────────
  socket.on("typing", (data: TypingPayload) => {
    const conversationId = data.conversation_id ?? data.conversationId;
    const receiverId = data.receiver_id ?? data.receiverId;
    if (!conversationId || !receiverId) return;

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", {
        sender_id: userId,
        conversation_id: conversationId,
      });
    }
  });

  socket.on("stopTyping", (data: TypingPayload) => {
    const conversationId = data.conversation_id ?? data.conversationId;
    const receiverId = data.receiver_id ?? data.receiverId;
    if (!conversationId || !receiverId) return;

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stopTyping", {
        sender_id: userId,
        conversation_id: conversationId,
      });
    }
  });

  // ── Join conversation room ───────────────────
  socket.on(
    "joinConversation",
    async (data: ConversationPayload, callback?: (ok: boolean) => void) => {
      try {
        const conversationId = data.conversation_id ?? data.conversationId;
        if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId)) {
          callback?.(false);
          return;
        }

        // Kiểm tra user có quyền vào room này không
        const conv = await Conversation.findOne({
          _id: conversationId,
          participant_ids: new mongoose.Types.ObjectId(userId),
        });

        if (!conv) {
          callback?.(false);
          return;
        }

        socket.join(conversationId);
        console.log(`[Socket] ${userId} joined room ${conversationId}`);
        callback?.(true);
      } catch (err) {
        console.error("[Socket] joinConversation error:", err);
        callback?.(false);
      }
    },
  );

  socket.on("leaveConversation", (data: ConversationPayload) => {
    const conversationId = data.conversation_id ?? data.conversationId;
    if (conversationId) socket.leave(conversationId);
  });

  // ── Mark as read ─────────────────────────────
  socket.on(
    "markAsRead",
    async (data: ConversationPayload, callback?: (ok: boolean) => void) => {
      try {
        const conversationId = data.conversation_id ?? data.conversationId;
        if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId)) {
          callback?.(false);
          return;
        }

        const conversation = await Conversation.findOne({
          _id: conversationId,
          participant_ids: new mongoose.Types.ObjectId(userId),
        });

        if (!conversation) {
          callback?.(false);
          return;
        }

        const now = new Date();

        // Đánh dấu đã đọc tất cả tin chưa đọc của mình
        await Message.updateMany(
          {
            conversation_id: conversationId,
            receiver_id: new mongoose.Types.ObjectId(userId),
            read_at: null,
          },
          { $set: { read_at: now } },
        );

        // Reset unread counter
        await Conversation.findByIdAndUpdate(conversationId, {
          $set: { [`unread_count.${userId}`]: 0 },
        });

        // Thông báo cho đối phương biết tin đã được đọc
        const partnerId = conversation.participant_ids
          .find((p) => p.toString() !== userId)
          ?.toString();

        if (partnerId) {
          const partnerSocketId = getReceiverSocketId(partnerId);
          if (partnerSocketId) {
            io.to(partnerSocketId).emit("messagesRead", {
              conversation_id: conversationId,
              read_by: userId,
              read_at: now,
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
}
