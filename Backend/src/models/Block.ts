import mongoose, { Schema, Document } from 'mongoose';

export interface IBlock extends Document {
  blocker_id: mongoose.Types.ObjectId;
  blocked_id: mongoose.Types.ObjectId;
  created_at: Date;
}

const BlockSchema: Schema = new Schema({
  blocker_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  blocked_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false },
  collection: 'blocks'
});

BlockSchema.index({ blocker_id: 1, blocked_id: 1 }, { unique: true });

export default mongoose.model<IBlock>('Block', BlockSchema);