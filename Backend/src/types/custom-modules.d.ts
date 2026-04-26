declare module "*.js";

declare module "./routes/messageRoutes.js" {
  import type { Router } from "express";
  const router: Router;
  export default router;
}

declare module "./services/socketService.js" {
  import type { Server } from "socket.io";

  export function initSocket(io: Server): void;
  export function emitNotification(userId: string, payload: unknown): void;
  export function emitMessage(userId: string, payload: unknown): void;
  export function emitMessageRead(userId: string, payload: unknown): void;
  export function isUserOnline(userId: string): boolean;
}

declare module "../services/socketService.js" {
  export function emitMessage(userId: string, payload: unknown): void;
  export function emitMessageRead(userId: string, payload: unknown): void;
  export function isUserOnline(userId: string): boolean;
}
