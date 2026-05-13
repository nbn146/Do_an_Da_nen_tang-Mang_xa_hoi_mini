import { Router } from "express";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

// Tất cả route đều yêu cầu đăng nhập
router.use(verifyToken);

// Lấy danh sách thông báo (phân trang: ?page=1&limit=20)
// GET /api/notifications
router.get("/", getNotifications);

// Lấy số lượng thông báo chưa đọc
// GET /api/notifications/unread-count
router.get("/unread-count", getUnreadCount);

// Đánh dấu TẤT CẢ thông báo đã đọc
// PATCH /api/notifications/read-all
// ⚠️ Route cố định phải đặt TRƯỚC route có param :notificationId
router.patch("/read-all", markAllAsRead);

// Đánh dấu 1 thông báo đã đọc
// PATCH /api/notifications/:notificationId/read
router.patch("/:notificationId/read", markAsRead);

// Xóa 1 thông báo
// DELETE /api/notifications/:notificationId
router.delete("/:notificationId", deleteNotification);

export default router;
