import mongoose, { Schema, type Document } from "mongoose";

export interface IMessage extends Document {
  conversation_id: mongoose.Types.ObjectId;
  sender_id: mongoose.Types.ObjectId;
  receiver_id: mongoose.Types.ObjectId;
  message_type: string;
  content: string;
  media_url?: string;
  deleted_by?: mongoose.Types.ObjectId;
  delivered_at: Date | null;
  read_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    conversation_id: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    sender_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    receiver_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    message_type: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text",
    },
    content: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
    media_url: {
      type: String,
    },
    deleted_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    delivered_at: {
      type: Date,
      default: null,
    },
    read_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

messageSchema.index({ conversation_id: 1, created_at: -1 });
messageSchema.index({ sender_id: 1, receiver_id: 1, created_at: -1 });

const Message = mongoose.model<IMessage>("Message", messageSchema);

export default Message;
