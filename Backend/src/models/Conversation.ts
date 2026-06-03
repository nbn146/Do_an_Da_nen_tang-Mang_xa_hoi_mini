import mongoose, { Schema, type Document } from "mongoose";

export interface IConversation extends Document {
  participant_ids: mongoose.Types.ObjectId[]; // Luôn có đúng 2 ID cho chat 1-1
  last_message_id: mongoose.Types.ObjectId | null; // Trỏ đến ID tin nhắn cuối cùng để hiển thị ra ngoài màn hình list
  unread_count: Map<string, number>; // (Tùy chọn) Lưu số tin nhắn chưa đọc của mỗi người
  created_at: Date;
  updated_at: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    participant_ids: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    last_message_id: {
      type: Schema.Types.ObjectId,
      ref: "Message", // Liên kết với bảng Message
      default: null,
    },
    // Lưu số lượng tin nhắn chưa đọc (VD: {"userId_A": 0, "userId_B": 3})
    unread_count: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

// Đánh index để load danh sách chat của 1 user cực nhanh
conversationSchema.index({ participant_ids: 1, updated_at: -1 });

const Conversation = mongoose.model<IConversation>(
  "Conversation",
  conversationSchema,
);

export default Conversation;
