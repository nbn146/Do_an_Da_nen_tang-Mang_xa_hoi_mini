import { Router } from 'express';
import { register, login, googleLogin ,sendPhoneOtp, verifyPhoneOtp,sendEmailOtp, verifyEmailOtp,resetPassword} from '../controllers/authController.js';


const router = Router();

// Route Đăng ký: POST /api/auth/register
router.post('/register', register);

// Route Đăng nhập: POST /api/auth/login
router.post('/login', login);
// Route Đăng nhập với Google: POST /api/auth/google
router.post('/google', googleLogin);

//Router OTP
router.post('/sendPhoneOtp', sendPhoneOtp);
router.post('/verifyPhoneOtp', verifyPhoneOtp);
router.post('/sendEmailOtp', sendEmailOtp);
router.post('/verifyEmailOtp', verifyEmailOtp);
//rOUTER RESET PW
router.post('/resetPassword', resetPassword);
export default router;