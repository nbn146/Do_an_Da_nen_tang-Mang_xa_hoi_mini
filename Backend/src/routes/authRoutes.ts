import { Router } from 'express';
import { register, login, googleLogin } from '../controllers/authController.js';

const router = Router();

// Route Đăng ký: POST /api/auth/register
router.post('/register', register);

// Route Đăng nhập: POST /api/auth/login
router.post('/login', login);
// Route Đăng nhập với Google: POST /api/auth/google
router.post('/google', googleLogin);
export default router;