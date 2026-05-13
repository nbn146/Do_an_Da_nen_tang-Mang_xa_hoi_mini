import { Router } from "express";
import {
  toggleFollow,
  toggleBlock,
  getFollowStatus,
  getFollowers,
  getFollowing,
  getPendingRequests,
  acceptFollowRequest,
  rejectFollowRequest,
  getFollowCounts,
} from "../controllers/followController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

// Tất cả route đều yêu cầu đăng nhập
router.use(verifyToken);

// ── Routes cố định (phải đặt TRƯỚC routes có :param) ──

// Kiểm tra trạng thái follow giữa mình và 1 user
// GET /api/follow/status/:targetId
router.get("/status/:targetId", getFollowStatus);

// Lấy danh sách yêu cầu follow đang chờ (dành cho tài khoản private)
// GET /api/follow/requests/pending
router.get("/requests/pending", getPendingRequests);

// Chấp nhận yêu cầu follow
// PATCH /api/follow/requests/:requestId/accept
router.patch("/requests/:requestId/accept", acceptFollowRequest);

// Từ chối yêu cầu follow
// DELETE /api/follow/requests/:requestId/reject
router.delete("/requests/:requestId/reject", rejectFollowRequest);

// Block / Unblock toggle
// POST /api/follow/block/:targetId
router.post("/block/:targetId", toggleBlock);

// ── Routes có :userId param ──

// Lấy số lượng followers / following
// GET /api/follow/:userId/counts
router.get("/:userId/counts", getFollowCounts);

// Lấy danh sách followers
// GET /api/follow/:userId/followers
router.get("/:userId/followers", getFollowers);

// Lấy danh sách following
// GET /api/follow/:userId/following
router.get("/:userId/following", getFollowing);

// ── Route chính ──

// Follow / Unfollow toggle
// POST /api/follow/:targetId
router.post("/:targetId", toggleFollow);

export default router;
