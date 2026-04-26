import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  recipient_id: mongoose.Types.ObjectId;
  sender_id?: mongoose.Types.ObjectId | null;
  type: "like" | "comment" | "follow" | "mention" | "system";
  target_id?: mongoose.Types.ObjectId | null;
  message: string;
  is_read: boolean;
  created_at: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    recipient_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sender_id: { type: Schema.Types.ObjectId, ref: "User", default: null },
    type: {
      type: String,
      enum: ["like", "comment", "follow", "mention", "system"],
      required: true,
    },
    target_id: { type: Schema.Types.ObjectId, default: null },
    message: { type: String, required: true },
    is_read: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
    collection: "notifications",
  },
);

NotificationSchema.index({ recipient_id: 1, created_at: -1 });
NotificationSchema.index({ recipient_id: 1, is_read: 1 });

export default mongoose.model<INotification>(
  "Notification",
  NotificationSchema,
);
