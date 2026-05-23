import { Router } from "express";
import {
  getConversations,
  createConversation,
  getMessages,
  sendMessage,
  deleteMessage,
  markAsRead,
} from "../controllers/conversationController.js";
import { verifyToken as authenticate } from "../middleware/authMiddleware.js";
import { createUploadMiddleware } from "../middleware/uploadMiddleware.js";

// Middleware cho upload file trong tin nhắn (1 file, max 5MB)
const uploadMessageFile = createUploadMiddleware('file', 1);

const router = Router();

console.log("🚀 File conversationRoutes đã được load");

// Tất cả route đều yêu cầu đăng nhập
router.use(authenticate);

// Lấy danh sách cuộc trò chuyện của user hiện tại
// GET /api/conversations
router.get("/", getConversations);

// Tạo conversation với 1 user (idempotent)
// POST /api/conversations/:receiverId
router.post("/:receiverId", createConversation);

// ─────────────────────────────────────────────
// Messages (nested under conversation)
// ─────────────────────────────────────────────

// Lấy tin nhắn trong conversation (phân trang: ?page=1&limit=30)
// GET /api/conversations/:conversationId/messages
router.get("/:conversationId/messages", getMessages);

// Gửi tin nhắn text
// POST /api/conversations/:conversationId/messages
// Body: { content: string, messageType: "text" }
router.post("/:conversationId/messages", sendMessage);

// Gửi tin nhắn có file/ảnh (upload với giới hạn 5MB)
// POST /api/conversations/:conversationId/messages/upload
// Form-data: file (field name: "file"), messageType: "image" | "file"
router.post(
  "/:conversationId/messages/upload",
  uploadMessageFile,
  sendMessage,
);

// Xoá tin nhắn phía mình (soft delete)
// DELETE /api/conversations/:conversationId/messages/:messageId
router.delete("/:conversationId/messages/:messageId", deleteMessage);

// Đánh dấu đã đọc tất cả tin trong conversation
// PATCH /api/conversations/:conversationId/read
router.patch("/:conversationId/read", markAsRead);

export default router;
