import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

 /**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               phone_number:
 *                  type: string
 *               password:
 *                 type: string
 *               display_name:
 *                 type: string
 *     responses:
 *       201:
 *         description: 🎉 Tạo tài khoản thành công!
 *       400:
 *         description: ❌ Dữ liệu gửi lên không hợp lệ (Thiếu trường bắt buộc).
 *    
 *       409:
 *         description: ⚠️ Trùng lặp dữ liệu (Username, Email hoặc SĐT đã tồn tại).
 *       500:
 *         description: 🔥 Lỗi hệ thống server nội bộ.
 *   
 */
router.post('/register', authController.register);




export default router;