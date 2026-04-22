import mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';
export interface IUser extends Document {
    username: string;
    email?: string;
    phone_number: string;
    password_hash: string;
    display_name: string;
    avatar_url: string;
    bio: string;
    settings: {
        language: string;
        privacy: 'public' | 'friends' | 'private';
        two_factor_enable: boolean;
    };
    status: 'active' | 'locked' | 'pending';
    created_at: Date;
    updated_at: Date;
}

const userSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email:{type: String, unique: true, sparse: true, lowercase: true, trim: true},
    phone_number: { type: String,  unique: true,sparse: true, trim: true },
    password_hash: { type: String, required: true },
    display_name: { type: String, required: true, trim: true },
    avatar_url: { type: String, default: 'avatars/default_profile.webp' },
    bio: { type: String, default: '' },
    settings: {
        language: { type: String, default: 'vi' },
        privacy: { type: String, enum: ['public', 'friends', 'private'], default: 'public' },
        two_factor_enable: { type: Boolean, default: false }
    },
    status: { type: String, enum: ['active', 'locked', 'pending'], default: 'active' }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'users'
});

export default mongoose.model<IUser>('User', userSchema);