import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  post_id: mongoose.Types.ObjectId;
  author_id: mongoose.Types.ObjectId;
  parent_id: mongoose.Types.ObjectId | null;
  content: string;
  stats: {
    likes: number;
    replies: number;
    is_deleted: boolean;
  };
  created_at: Date;
  updated_at: Date;
}

const CommentSchema: Schema = new Schema({
  post_id: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  author_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  parent_id: { type: Schema.Types.ObjectId, ref: 'Comment', default: null }, // Đệ quy: tham chiếu lại chính bảng Comment
  content: { type: String, required: true },
  stats: {
    likes: { type: Number, default: 0 },
    replies: { type: Number, default: 0 },
    is_deleted: { type: Boolean, default: false }
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'comments'
});

CommentSchema.index({ post_id: 1, created_at: -1 });
CommentSchema.index({ parent_id: 1 });

export default mongoose.model<IComment>('Comment', CommentSchema);