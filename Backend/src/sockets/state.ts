import type { Server } from "socket.io";
import type { ConnectedUsers } from "./types.js";

// ─────────────────────────────────────────────
// Singleton state cho Socket.IO
// Tất cả handlers và helpers đều đọc/ghi qua module này
// ─────────────────────────────────────────────

let io: Server;
const connectedUsers: ConnectedUsers = {};

// ── IO instance ──────────────────────────────

export function setIo(instance: Server): void {
  io = instance;
}

export function getIo(): Server {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
}

// ── Connected users ──────────────────────────

export function setUserOnline(userId: string, socketId: string): void {
  connectedUsers[userId] = socketId;
}

export function setUserOffline(userId: string): void {
  delete connectedUsers[userId];
}

export function getReceiverSocketId(userId: string): string | undefined {
  return connectedUsers[userId];
}

export function getConnectedUsers(): ConnectedUsers {
  return connectedUsers;
}
