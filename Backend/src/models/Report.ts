import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  reporter_id: mongoose.Types.ObjectId;
  target_id: mongoose.Types.ObjectId;
  target_type: 'post' | 'comment' | 'user';
  reason: string;
  description?: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'rejected';
  created_at: Date;
  resolved_at?: Date | null;
}

const ReportSchema: Schema = new Schema({
  reporter_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  target_id: { type: Schema.Types.ObjectId, required: true }, // Không dùng ref cứng vì có thể là Post, Comment hoặc User
  target_type: { type: String, enum: ['post', 'comment', 'user'], required: true },
  reason: { type: String, required: true },
  description: { type: String, default: null },
  status: { type: String, enum: ['pending', 'reviewing', 'resolved', 'rejected'], default: 'pending' },
  resolved_at: { type: Date, default: null }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false },
  collection: 'reports'
});

ReportSchema.index({ reporter_id: 1, target_id: 1 }, { unique: true });
ReportSchema.index({ status: 1, created_at: 1 });

export default mongoose.model<IReport>('Report', ReportSchema);