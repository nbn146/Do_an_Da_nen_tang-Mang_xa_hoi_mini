import { Router } from "express";
import multer from "multer";
import {
  commentPost,
  createPost,
  getNewsfeed,
  reactToPost,
} from "../controllers/postController.js";
import { protect } from "../middleware/auth.js";

const upload = multer({ dest: "uploads/" });
const router = Router();

router.get("/newsfeed", protect, getNewsfeed);
router.post("/", protect, upload.single("image"), createPost);
router.post("/:postId/react", protect, reactToPost);
router.post("/:postId/comment", protect, commentPost);

export default router;
