import mongoose, { Schema, type Document } from "mongoose";

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[]; // Luôn có đúng 2 ID cho chat 1-1
  lastMessage: mongoose.Types.ObjectId | null; // Trỏ đến ID tin nhắn cuối cùng để hiển thị ra ngoài màn hình list
  unreadCount: Map<string, number>; // (Tùy chọn) Lưu số tin nhắn chưa đọc của mỗi người
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message", // Liên kết với bảng Message
      default: null,
    },
    // Lưu số lượng tin nhắn chưa đọc (VD: {"userId_A": 0, "userId_B": 3})
    unreadCount: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

// Đánh index để load danh sách chat của 1 user cực nhanh
conversationSchema.index({ participants: 1, updatedAt: -1 });

const Conversation = mongoose.model<IConversation>(
  "Conversation",
  conversationSchema,
);

export default Conversation;
