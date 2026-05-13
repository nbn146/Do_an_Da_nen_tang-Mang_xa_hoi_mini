import type { Request, Response } from "express";
import mongoose from "mongoose";
import Notification from "../models/Notification.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { getIo, getReceiverSocketId } from "../sockets/state.js";

interface AuthRequest extends Request {
  userId?: string;
}

// ─────────────────────────────────────────────
// Params cho hàm tạo notification (dùng nội bộ, không phải API)
// ─────────────────────────────────────────────
export interface CreateNotificationParams {
  recipient_id: string;
  sender_id: string;
  type: "like" | "comment" | "follow" | "mention" | "system";
  target_id?: string;
  message: string;
}

// ─────────────────────────────────────────────
// HELPER: Tạo notification + emit realtime qua Socket.IO
// Được gọi từ các controller khác (follow, like, comment, v.v.)
// ─────────────────────────────────────────────
export async function createNotification(
  params: CreateNotificationParams,
): Promise<void> {
  try {
    // Không tự thông báo cho chính mình
    if (params.sender_id === params.recipient_id) return;

    const notification = await Notification.create({
      recipient_id: new mongoose.Types.ObjectId(params.recipient_id),
      sender_id: new mongoose.Types.ObjectId(params.sender_id),
      type: params.type,
      target_id: params.target_id
        ? new mongoose.Types.ObjectId(params.target_id)
        : null,
      message: params.message,
    });

    // Populate sender info để FE hiển thị được ngay
    const populated = await notification.populate(
      "sender_id",
      "_id username display_name avatar_url",
    );

    // Emit realtime nếu recipient đang online
    const recipientSocketId = getReceiverSocketId(params.recipient_id);
    if (recipientSocketId) {
      try {
        getIo().to(recipientSocketId).emit("notification:new", populated);
      } catch {
        // Socket chưa khởi tạo — bỏ qua, FE sẽ fetch khi load trang
      }
    }
  } catch (err) {
    console.error("[Notification] createNotification error:", err);
  }
}

// ─────────────────────────────────────────────
// 1. Lấy danh sách thông báo của user (phân trang)
// GET /api/notifications?page=1&limit=20
// ─────────────────────────────────────────────
export const getNotifications = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId as string;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, parseInt(req.query.limit as string) || 20);

    const total = await Notification.countDocuments({
      recipient_id: new mongoose.Types.ObjectId(userId),
    });

    const notifications = await Notification.find({
      recipient_id: new mongoose.Types.ObjectId(userId),
    })
      .sort({ created_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("sender_id", "_id username display_name avatar_url")
      .lean();

    const unreadCount = await Notification.countDocuments({
      recipient_id: new mongoose.Types.ObjectId(userId),
      is_read: false,
    });

    successResponse(
      req,
      res,
      {
        notifications,
        unreadCount,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      "notification.FETCHED",
      200,
      "FETCHED",
    );
  } catch (error) {
    console.error("Error in getNotifications:", error);
    errorResponse(req, res, "common.SERVER_ERROR", 500, "SERVER_ERROR");
  }
};

// ─────────────────────────────────────────────
// 2. Lấy số lượng thông báo chưa đọc
// GET /api/notifications/unread-count
// ─────────────────────────────────────────────
export const getUnreadCount = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId as string;

    const count = await Notification.countDocuments({
      recipient_id: new mongoose.Types.ObjectId(userId),
      is_read: false,
    });

    successResponse(
      req,
      res,
      { unreadCount: count },
      "notification.UNREAD_COUNT",
      200,
      "UNREAD_COUNT",
    );
  } catch (error) {
    console.error("Error in getUnreadCount:", error);
    errorResponse(req, res, "common.SERVER_ERROR", 500, "SERVER_ERROR");
  }
};

// ─────────────────────────────────────────────
// 3. Đánh dấu 1 thông báo đã đọc
// PATCH /api/notifications/:notificationId/read
// ─────────────────────────────────────────────
export const markAsRead = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId as string;
    const { notificationId } = req.params as { notificationId: string };

    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      errorResponse(
        req,
        res,
        "notification.INVALID_ID",
        400,
        "INVALID_ID",
      );
      return;
    }

    const notification = await Notification.findOneAndUpdate(
      {
        _id: notificationId,
        recipient_id: new mongoose.Types.ObjectId(userId),
      },
      { is_read: true },
      { new: true },
    );

    if (!notification) {
      errorResponse(
        req,
        res,
        "notification.NOT_FOUND",
        404,
        "NOT_FOUND",
      );
      return;
    }

    successResponse(
      req,
      res,
      notification,
      "notification.MARKED_READ",
      200,
      "MARKED_READ",
    );
  } catch (error) {
    console.error("Error in markAsRead:", error);
    errorResponse(req, res, "common.SERVER_ERROR", 500, "SERVER_ERROR");
  }
};

// ─────────────────────────────────────────────
// 4. Đánh dấu TẤT CẢ thông báo đã đọc
// PATCH /api/notifications/read-all
// ─────────────────────────────────────────────
export const markAllAsRead = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId as string;

    const result = await Notification.updateMany(
      {
        recipient_id: new mongoose.Types.ObjectId(userId),
        is_read: false,
      },
      { is_read: true },
    );

    successResponse(
      req,
      res,
      { modifiedCount: result.modifiedCount },
      "notification.ALL_MARKED_READ",
      200,
      "ALL_MARKED_READ",
    );
  } catch (error) {
    console.error("Error in markAllAsRead:", error);
    errorResponse(req, res, "common.SERVER_ERROR", 500, "SERVER_ERROR");
  }
};

// ─────────────────────────────────────────────
// 5. Xóa 1 thông báo
// DELETE /api/notifications/:notificationId
// ─────────────────────────────────────────────
export const deleteNotification = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId as string;
    const { notificationId } = req.params as { notificationId: string };

    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      errorResponse(
        req,
        res,
        "notification.INVALID_ID",
        400,
        "INVALID_ID",
      );
      return;
    }

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient_id: new mongoose.Types.ObjectId(userId),
    });

    if (!notification) {
      errorResponse(
        req,
        res,
        "notification.NOT_FOUND",
        404,
        "NOT_FOUND",
      );
      return;
    }

    successResponse(
      req,
      res,
      { notificationId },
      "notification.DELETED",
      200,
      "DELETED",
    );
  } catch (error) {
    console.error("Error in deleteNotification:", error);
    errorResponse(req, res, "common.SERVER_ERROR", 500, "SERVER_ERROR");
  }
};
