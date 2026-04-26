import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { env } from "../config/env.js";
import Message from "../models/Message.js";

let ioInstance;

const onlineUsers = new Map();

function addUserSocket(userId, socketId) {
  const key = String(userId);
  const socketIds = onlineUsers.get(key) || new Set();
  socketIds.add(socketId);
  onlineUsers.set(key, socketIds);
}

function removeSocket(socketId) {
  for (const [userId, socketIds] of onlineUsers.entries()) {
    socketIds.delete(socketId);
    if (socketIds.size === 0) {
      onlineUsers.delete(userId);
    }
  }
}

function emitToUser(userId, eventName, payload) {
  if (!ioInstance) return;

  const socketIds = onlineUsers.get(String(userId));
  if (!socketIds || socketIds.size === 0) return;

  for (const socketId of socketIds) {
    ioInstance.to(socketId).emit(eventName, payload);
  }
}

function safeAck(callback, payload) {
  if (typeof callback === "function") {
    callback(payload);
  }
}

function extractToken(socket) {
  const fromAuth = socket.handshake?.auth?.token;
  if (typeof fromAuth === "string" && fromAuth.trim()) {
    return fromAuth.trim();
  }

  const authHeader = socket.handshake?.headers?.authorization;
  if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }

  return null;
}

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(String(id));
}

function toMessageDto(message) {
  return {
    _id: String(message._id),
    sender: String(message.sender),
    receiver: String(message.receiver),
    content: message.content,
    createdAt: message.createdAt,
    deliveredAt: message.deliveredAt,
    readAt: message.readAt,
  };
}

export function isUserOnline(userId) {
  const socketIds = onlineUsers.get(String(userId));
  return Boolean(socketIds && socketIds.size > 0);
}

export function initSocket(io) {
  ioInstance = io;

  io.use((socket, next) => {
    const token = extractToken(socket);
    if (!token) {
      return next();
    }

    try {
      const decoded = jwt.verify(token, env.jwtSecret);
      if (decoded && decoded.userId) {
        socket.data.userId = String(decoded.userId);
      }
      return next();
    } catch {
      return next(new Error("Unauthorized socket"));
    }
  });

  io.on("connection", (socket) => {
    if (socket.data?.userId) {
      addUserSocket(socket.data.userId, socket.id);
    }

    socket.on("register-user", (userId) => {
      if (!userId) return;
      addUserSocket(userId, socket.id);
    });

    socket.on("message:send", async (payload = {}, ack) => {
      try {
        const senderId = String(socket.data?.userId || "");
        const receiverId = String(payload.receiverId || "");
        const content =
          typeof payload.content === "string" ? payload.content.trim() : "";

        if (!senderId) {
          safeAck(ack, { ok: false, message: "Unauthorized" });
          return;
        }

        if (!isValidObjectId(receiverId)) {
          safeAck(ack, { ok: false, message: "receiverId is invalid" });
          return;
        }

        if (!content) {
          safeAck(ack, { ok: false, message: "content is required" });
          return;
        }

        if (receiverId === senderId) {
          safeAck(ack, {
            ok: false,
            message: "Cannot send message to yourself",
          });
          return;
        }

        const message = await Message.create({
          sender: senderId,
          receiver: receiverId,
          content,
          deliveredAt: isUserOnline(receiverId) ? new Date() : null,
        });

        const messagePayload = toMessageDto(message);
        emitMessage(receiverId, messagePayload);
        emitMessage(senderId, messagePayload);

        safeAck(ack, { ok: true, data: messagePayload });
      } catch (error) {
        console.error("socket message:send error:", error);
        safeAck(ack, {
          ok: false,
          message: "Server error while sending message",
        });
      }
    });

    socket.on("message:read", async (payload = {}, ack) => {
      try {
        const readerId = String(socket.data?.userId || "");
        const otherUserId = String(payload.otherUserId || "");

        if (!readerId) {
          safeAck(ack, { ok: false, message: "Unauthorized" });
          return;
        }

        if (!isValidObjectId(otherUserId)) {
          safeAck(ack, { ok: false, message: "otherUserId is invalid" });
          return;
        }

        const readAt = new Date();
        const result = await Message.updateMany(
          {
            sender: otherUserId,
            receiver: readerId,
            readAt: null,
          },
          { $set: { readAt } },
        );

        if (result.modifiedCount > 0) {
          emitMessageRead(otherUserId, {
            readerId,
            readAt,
          });
        }

        safeAck(ack, {
          ok: true,
          updatedCount: result.modifiedCount,
          readAt,
        });
      } catch (error) {
        console.error("socket message:read error:", error);
        safeAck(ack, { ok: false, message: "Server error while marking read" });
      }
    });

    socket.on("disconnect", () => {
      removeSocket(socket.id);
    });
  });
}

export function emitNotification(userId, payload) {
  emitToUser(userId, "notification:new", payload);
}

export function emitMessage(userId, payload) {
  emitToUser(userId, "message:new", payload);
}

export function emitMessageRead(userId, payload) {
  emitToUser(userId, "message:read", payload);
}
