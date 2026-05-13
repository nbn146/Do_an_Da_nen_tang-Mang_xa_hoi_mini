import type { Request, Response } from 'express';
// Đảm bảo đường dẫn import Model khớp với project của bạn

import PostModel from '../models/postModel.js';
import User from '../models/userModel.js';
import { uploadAndCompressImage } from '../services/minioService.js';
import { successResponse, errorResponse } from "../utils/response.js";

// ==========================================
// 1. LẤY THÔNG TIN PROFILE & BÀI VIẾT
// ==========================================
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // ID của user cần xem profile

    // Lấy thông tin user (giấu password đi)
    const user = await User.findById(id).select('-password');
    if (!user) {
      errorResponse(req, res, "user.NOT_FOUND", 404, "NOT_FOUND");
      return;
    }

    // Lấy các bài viết của user này
    const posts = await PostModel.find({ author_id: id })
      .sort({ created_at: -1 })
      .lean();

    successResponse(req, res, { user, posts }, "user.PROFILE_FETCHED", 200, "PROFILE_FETCHED");
  } catch (error: any) {
    console.error("Lỗi lấy profile:", error);
    errorResponse(req, res, "common.SERVER_ERROR", 500, "SERVER_ERROR");
  }
};

// ==========================================
// 2. CẬP NHẬT THÔNG TIN & AVATAR
// ==========================================
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId; // Lấy ID từ Token
    const { display_name, bio } = req.body;

    let avatarUrl = undefined;

    // Nếu user có gửi file ảnh lên -> Nén WebP và up lên MinIO
    if (req.file) {
      avatarUrl = await uploadAndCompressImage(req.file.buffer);
    }

    // Cập nhật vào DB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(display_name && { display_name }),
        ...(bio && { bio }),
        ...(avatarUrl && { avatarUrl })
      },
      { new: true } // Trả về data mới sau khi update
    ).select('-password');

    successResponse(req, res, updatedUser, "user.UPDATED", 200, "UPDATED");
  } catch (error: any) {
    console.error("Lỗi cập nhật profile:", error);
    errorResponse(req, res, "common.SERVER_ERROR", 500, "SERVER_ERROR");
  }
};

// ==========================================
// 3. FOLLOW / UNFOLLOW
// ==========================================
export const toggleFollow = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUserId = (req as any).userId; // Người đang bấm Follow
    const { targetId } = req.params; // Người được Follow

    if (!targetId) {
      errorResponse(req, res, "user.MISSING_TARGET_ID", 400, "MISSING_TARGET_ID");
      return;
    }

    if (currentUserId === targetId) {
      errorResponse(req, res, "user.CANNOT_FOLLOW_SELF", 400, "CANNOT_FOLLOW_SELF");
      return;
    }

    const targetUser = await User.findById(targetId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      errorResponse(req, res, "user.NOT_FOUND", 404, "NOT_FOUND");
      return;
    }

    // Kiểm tra xem đã follow chưa bằng cách so sánh string của ObjectId
    const isFollowing = currentUser.following.some(id => id.toString() === targetId.toString());

    if (isFollowing) {
      // Nếu đã follow -> Unfollow
      await User.findByIdAndUpdate(currentUserId, { $pull: { following: targetId } });
      await User.findByIdAndUpdate(targetId, { $pull: { followers: currentUserId } });
      successResponse(req, res, null, "user.UNFOLLOWED", 200, "UNFOLLOWED");
    } else {
      // Nếu chưa follow -> Follow
      await User.findByIdAndUpdate(currentUserId, { $push: { following: targetId } });
      await User.findByIdAndUpdate(targetId, { $push: { followers: currentUserId } });
      successResponse(req, res, null, "user.FOLLOWED", 200, "FOLLOWED");
    }
  } catch (error: any) {
    console.error("Lỗi Follow:", error);
    errorResponse(req, res, "common.SERVER_ERROR", 500, "SERVER_ERROR");
  }
};