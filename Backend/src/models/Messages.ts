import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  sender_id: mongoose.Types.ObjectId;
  receiver_id: mongoose.Types.ObjectId;
  content?: string;
  media_url?: string;
  status: 'sent' | 'delivered' | 'read';
  created_at: Date;
}

const MessageSchema: Schema = new Schema({
  sender_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiver_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, default: null },
  media_url: { type: String, default: null },
  status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false },
  collection: 'messages'
});

MessageSchema.index({ sender_id: 1, receiver_id: 1, created_at: -1 });
MessageSchema.index({ receiver_id: 1, sender_id: 1, created_at: -1 });

export default mongoose.model<IMessage>('Message', MessageSchema);