import { Server, Socket } from "socket.io";

// ─────────────────────────────────────────────
// Shared types cho toàn bộ socket module
// ─────────────────────────────────────────────

/** Map userId → socketId để tra cứu nhanh user đang online */
export interface ConnectedUsers {
  [userId: string]: string;
}

/** Payload FE gửi khi typing / stopTyping */
export interface TypingPayload {
  conversationId: string;
  receiverId: string;
}

/** Payload FE gửi khi join / leave conversation */
export interface ConversationPayload {
  conversationId: string;
}

/** Socket đã qua auth middleware sẽ có data.userId */
export interface AuthenticatedSocket extends Socket {
  data: {
    userId: string;
    [key: string]: unknown;
  };
}

export type { Server, Socket };
