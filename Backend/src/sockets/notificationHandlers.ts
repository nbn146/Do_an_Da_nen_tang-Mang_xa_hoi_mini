import mongoose from "mongoose";
import Notification from "../models/Notification.js";
import { getIo, getReceiverSocketId } from "./state.js";
import type { AuthenticatedSocket, ConversationPayload } from "./types.js";

// ─────────────────────────────────────────────
// Notification handlers: markNotificationRead qua socket
// ─────────────────────────────────────────────

/** Đăng ký event liên quan đến notification cho 1 socket */
export function registerNotificationHandlers(
  socket: AuthenticatedSocket,
): void {
  const userId = socket.data.userId;

  // ── Đánh dấu đã đọc 1 notification qua socket (thay vì REST) ──
  socket.on(
    "notification:read",
    async (
      data: { notificationId: string },
      callback?: (ok: boolean) => void,
    ) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(data.notificationId)) {
          callback?.(false);
          return;
        }

        const result = await Notification.findOneAndUpdate(
          {
            _id: data.notificationId,
            recipient_id: new mongoose.Types.ObjectId(userId),
          },
          { is_read: true },
          { new: true },
        );

        callback?.(!!result);
      } catch (err) {
        console.error("[Socket] notification:read error:", err);
        callback?.(false);
      }
    },
  );

  // ── Đánh dấu tất cả đã đọc qua socket ──
  socket.on(
    "notification:readAll",
    async (callback?: (ok: boolean) => void) => {
      try {
        await Notification.updateMany(
          {
            recipient_id: new mongoose.Types.ObjectId(userId),
            is_read: false,
          },
          { is_read: true },
        );

        callback?.(true);
      } catch (err) {
        console.error("[Socket] notification:readAll error:", err);
        callback?.(false);
      }
    },
  );
}
