import { Router } from "express";
import multer from "multer";
import { getProfile, updateMyAvatar } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.get("/:userId/profile", protect, getProfile);
router.patch("/me/avatar", protect, upload.single("avatar"), updateMyAvatar);

export default router;
