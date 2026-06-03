import mongoose from "mongoose";
import Message from "../models/Message.js";
import { getIo, getReceiverSocketId, getConnectedUsers } from "./state.js";

// ─────────────────────────────────────────────
// Helpers dùng chung cho socket module
// ─────────────────────────────────────────────

/**
 * Khi user kết nối lại, đánh dấu `delivered_at` cho những tin nhắn
 * đã gửi cho họ trong khi offline (`delivered_at = null`).
 * Sau đó thông báo sender rằng tin đã được deliver.
 */
export async function flushPendingDeliveries(userId: string): Promise<void> {
  try {
    const io = getIo();
    const connectedUsers = getConnectedUsers();

    const pendingMessages = await Message.find(
      {
        receiver_id: new mongoose.Types.ObjectId(userId),
        delivered_at: null,
      },
      { conversation_id: 1, sender_id: 1, _id: 1 },
    ).limit(50);

    if (pendingMessages.length === 0) return;

    const messageIds = pendingMessages.map((msg) => msg._id);

    const result = await Message.updateMany(
      { _id: { $in: messageIds } },
      { $set: { delivered_at: new Date() } },
    );

    if (result.modifiedCount > 0) {
      // Group theo sender để giảm số emit
      const bySender: Record<string, string[]> = {};
      for (const msg of pendingMessages) {
        const senderId = msg.sender_id.toString();
        if (!bySender[senderId]) bySender[senderId] = [];
        bySender[senderId].push(msg._id.toString());
      }

      for (const [senderId, messageIds] of Object.entries(bySender)) {
        const senderSocketId = connectedUsers[senderId];
        if (senderSocketId) {
          io.to(senderSocketId).emit("messagesDelivered", {
            receiver_id: userId,
            message_ids: messageIds,
          });
        }
      }
    }
  } catch (err) {
    console.error("[Socket] flushPendingDeliveries error:", err);
  }
}
