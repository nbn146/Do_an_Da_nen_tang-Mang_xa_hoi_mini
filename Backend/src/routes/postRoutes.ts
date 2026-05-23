import express from 'express';
import { createPost } from '../controllers/postController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { uploadMultipleImages } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Upload tối đa 5 ảnh với giới hạn 5MB/ảnh (chống tràn RAM)
router.post('/createPost', verifyToken, uploadMultipleImages, createPost);

export default router;