import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import {
  getMyProfile,
  getSuggestedUsers,
  getUserProfile,
  toggleFollow,
  updateProfile,
} from '../controllers/userController.js';
import { uploadSingleImage } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// 1. Xem Profile (Bất kỳ ai có token đều xem được)
router.get('/me', verifyToken, getMyProfile);
router.get('/suggested', verifyToken, getSuggestedUsers);
router.get('/profile/:id', verifyToken, getUserProfile);

// 2. Cập nhật Profile (Upload avatar với giới hạn 5MB)
router.put('/update', verifyToken, uploadSingleImage, updateProfile);

// 3. Follow / Unfollow
router.post('/follow/:targetId', verifyToken, toggleFollow);

export default router;
