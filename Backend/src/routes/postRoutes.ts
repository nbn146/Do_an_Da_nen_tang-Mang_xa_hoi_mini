import express from 'express';
import multer from 'multer';
import { createPost } from '../controllers/postController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();
// Dùng memoryStorage để lưu file trên RAM, sau đó Sharp nén xong mới đẩy đi
const upload = multer({ storage: multer.memoryStorage() }); 

// array('images', 5) -> cho phép up tối đa 5 ảnh một lúc với field name là 'images'
router.post('/createPost', verifyToken, upload.array('images', 5), createPost);

export default router;