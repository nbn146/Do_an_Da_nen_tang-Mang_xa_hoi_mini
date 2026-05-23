import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { getUserProfile, updateProfile, toggleFollow } from '../controllers/userController.js';
import { uploadSingleImage } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// 1. Xem Profile (Bất kỳ ai có token đều xem được)
router.get('/profile/:id', verifyToken, getUserProfile);

// 2. Cập nhật Profile (Upload avatar với giới hạn 5MB)
router.put('/update', verifyToken, uploadSingleImage, updateProfile);

// 3. Follow / Unfollow
router.post('/follow/:targetId', verifyToken, toggleFollow);

export default router;