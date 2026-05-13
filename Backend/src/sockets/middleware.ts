import jwt from "jsonwebtoken";
import type { Socket } from "socket.io";

// ─────────────────────────────────────────────
// Socket.IO middleware: xác thực JWT
// ─────────────────────────────────────────────

/**
 * Middleware xác thực token trước khi cho phép kết nối socket.
 * Token có thể nằm ở `socket.handshake.auth.token`
 * hoặc header `Authorization: Bearer <token>`.
 */
export function authMiddleware(
  socket: Socket,
  next: (err?: Error) => void,
): void {
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
  } catch {
    next(new Error("Authentication error: Invalid token"));
  }
}
