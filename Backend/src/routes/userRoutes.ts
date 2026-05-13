import express from 'express';
import multer from 'multer';
import { verifyToken } from '../middleware/authMiddleware.js';
import { getUserProfile, updateProfile, toggleFollow } from '../controllers/userController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// 1. Xem Profile (Bất kỳ ai có token đều xem được)
router.get('/profile/:id', verifyToken, getUserProfile);

// 2. Cập nhật Profile (Chỉ cho phép up 1 ảnh với field name là 'avatar')
router.put('/update', verifyToken, upload.single('avatar'), updateProfile);

// 3. Follow / Unfollow
router.post('/follow/:targetId', verifyToken, toggleFollow);

export default router;