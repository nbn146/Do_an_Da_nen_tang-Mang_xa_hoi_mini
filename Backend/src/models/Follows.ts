import mongoose, { Schema, Document } from 'mongoose';

export interface IFollow extends Document {
  follower_id: mongoose.Types.ObjectId;
  following_id: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted';
  created_at: Date;
}

const FollowSchema: Schema = new Schema({
  follower_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  following_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted'], default: 'accepted' }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false },
  collection: 'follows'
});

// Đảm bảo không follow trùng
FollowSchema.index({ follower_id: 1, following_id: 1 }, { unique: true });

export default mongoose.model<IFollow>('Follow', FollowSchema);