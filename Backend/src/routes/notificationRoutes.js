import { Router } from "express";
import {
  getMyNotifications,
  markAsRead,
} from "../controllers/notificationController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/", protect, getMyNotifications);
router.patch("/:notificationId/read", protect, markAsRead);

export default router;
