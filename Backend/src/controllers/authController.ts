import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, phone_number, password, display_name } = req.body;
    console.log("👉 1. Backend nhận được dữ liệu:", req.body);

    

    // Kiểm tra trùng lặp Tên đăng nhập
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      console.log("❌ Lỗi: Username đã tồn tại");
      res.status(400).json({ message: 'Tên đăng nhập đã có người sử dụng!' });
      return;
    }

    // Kiểm tra trùng Email (Nếu có gửi email lên)
    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        console.log("❌ Lỗi: Email đã tồn tại");
        res.status(400).json({ message: 'Email này đã được đăng ký!' });
        return;
      }
    }

    // Kiểm tra trùng Số điện thoại (Nếu có gửi phone lên)
    if (phone_number) {
      const existingPhone = await User.findOne({ phone_number });
      if (existingPhone) {
        console.log("❌ Lỗi: Phone đã tồn tại");  
        res.status(400).json({ message: 'Số điện thoại này đã được đăng ký!' });
        return;
      }
    }

    console.log("✅ 2. Dữ liệu hợp lệ, chuẩn bị băm mật khẩu...");
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    console.log("✅ 3. Chuẩn bị lưu vào Database...");
   const newUser = new User({
  username: username,
  
  // Xử lý Email: Nếu là chuỗi rỗng thì BẮT BUỘC gán bằng null để tránh lỗi pattern '@'
  email: (email && email.trim() !== "") ? email : null,
  
  // Xử lý Số điện thoại: Chuỗi rỗng -> null
  phone_number: (phone_number && phone_number.trim() !== "") ? phone_number : null,
  
  password_hash: password_hash,
  display_name: display_name || username,
  
  // 2 Trường bắt buộc theo Schema của Toản:
  status: 'active', // Hoặc 'pending' tùy logic của bạn
  created_at: new Date() 
});

    await newUser.save();
    console.log("🎉 4. LƯU THÀNH CÔNG VÀO MONGODB!");

    res.status(201).json({ message: 'Đăng ký tài khoản thành công!' });

  } catch (error: any) {
    // CAMERA GIÁM SÁT LỖI MONGODB:
    console.error('🚨 LỖI NGHIÊM TRỌNG TỪ MONGODB:', error);
    
    // Bắt lỗi E11000 Duplicate Key của MongoDB
    if (error.code === 11000) {
      res.status(400).json({ message: 'Hệ thống báo trùng lặp dữ liệu (Lỗi Index)!' });
    } else if (error.name === 'ValidationError' || (error.message && error.message.includes('LỖI BẢO MẬT'))) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Lỗi server không xác định!' });
    }
  }
};

// [POST] /api/auth/login
// export const login = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { username, password } = req.body;

//     // 1. Tìm người dùng trong Database
//     const user = await User.findOne({ username });
//     if (!user) {
//       res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng!' });
//       return;
//     }

//     // 2. So sánh mật khẩu người dùng nhập với mật khẩu đã băm
//     const isMatch = await bcrypt.compare(password, user.password_hash);
//     if (!isMatch) {
//       res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng!' });
//       return;
//     }

//     // 3. Tạo thẻ thông hành (JWT) có hạn trong 7 ngày
//     const token = jwt.sign(
//       { userId: user._id, role: user.status }, 
//       JWT_SECRET, 
//       { expiresIn: '7d' }
//     );

//     // 4. Trả về token và thông tin cơ bản
//     res.status(200).json({
//       message: 'Đăng nhập thành công!',
//       token,
//       user: {
//         id: user._id,
//         username: user.username,
//         display_name: user.display_name,
//         avatar_url: user.avatar_url
//       }
//     });
//   } catch (error) {
//     console.error('Lỗi Login:', error);
//     res.status(500).json({ message: 'Lỗi server.' });
//   }
// };

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("👉 Dữ liệu Login nhận được:", req.body);
    // Frontend gửi lên trường tên là 'username', nhưng thực chất nó có thể là email hoặc số điện thoại
    const { account , password } = req.body;

    if (!account || !password) {
      res.status(400).json({ message: 'Vui lòng nhập tài khoản và mật khẩu!' });
      return;
    }

    // TÌM KIẾM: Chỉ dùng email hoặc số điện thoại (không dùng username)
    const user = await User.findOne({
      $or: [
        { email: account },
        { phone_number: account }
      ]
    });

    // Nếu không tìm thấy
    if (!user) {
      res.status(401).json({ message: 'Email hoặc Số điện thoại không tồn tại!' });
      return;
    }

    // Kiểm tra mật khẩu (Giữ nguyên logic cũ của bạn)
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({ message: 'Mật khẩu không chính xác!' });
      return;
    }

    // Cấp phát Token (Giữ nguyên logic cũ của bạn)
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET || 'secret_key_cua_toan', 
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Đăng nhập thành công!',
      token,
      user: {
        id: user._id,
        username: user.username,
        display_name: user.display_name,
        email: user.email,
        phone_number: user.phone_number
      }
    });

  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    res.status(500).json({ message: 'Lỗi server khi đăng nhập' });
  }
};


// [POST] /api/auth/google
export const googleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idToken } = req.body;
    console.log('🔍 Google Login request received');

    if (!idToken) {
      console.error('❌ Missing idToken in request body');
      res.status(400).json({ message: 'Thiếu Google ID Token!' });
      return;
    }
    
    // Kiểm tra xem biến môi trường có tồn tại không trước khi gọi Google
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error('❌ GOOGLE_CLIENT_ID not configured');
      res.status(500).json({ message: 'Server chưa cấu hình Google Client ID' });
      return;
    }

    console.log('🔐 Verifying token with Google...');
    // 1. Xác minh token với Server của Google
    let ticket: any;
    try {
      ticket = await client.verifyIdToken({
        idToken,
        audience: clientId,
      });
    } catch (verifyError: any) {
      console.error('❌ Token verification failed:', verifyError?.message);
      res.status(401).json({ 
        message: 'Token xác minh thất bại từ Google',
        details: verifyError?.message
      });
      return;
    }

    const payload = ticket.getPayload();
    console.log('✅ Token verified successfully, payload:', { email: payload?.email });
    
    if (!payload) {
      console.error('❌ No payload in ticket');
      res.status(400).json({ message: 'Token không hợp lệ!' });
      return;
    }

    // 2. Lấy thông tin từ Google
    const { email, name, picture } = payload;

    // 3. Kiểm tra xem user này đã từng đăng nhập chưa
    if (!email) {
      console.error('❌ Email not provided by Google');
      throw new Error("Email is required from Google")
    }
    
    console.log(`🔍 Looking for user with email: ${email}`);
    let user = await User.findOne({ email })

    if (!user) {
      console.log(`👤 User not found, creating new account...`);
      // 4. Nếu chưa có tài khoản -> Tự động đăng ký mới cho họ
      
      // Tạo một username ngẫu nhiên từ email (VD: toan@gmail.com -> toan_8374)
      const baseUsername = email?.split('@')[0] || 'user';
      const randomUsername = `${baseUsername}_${Math.floor(Math.random() * 10000)}`;

      // Vì Database bắt buộc phải có mật khẩu, ta tạo một mật khẩu ảo và băm nó
      const randomPassword = Math.random().toString(36).slice(-10);
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(randomPassword, salt);

      user = new User({
        username: randomUsername,
        email: email,
        password_hash: password_hash,
        display_name: name || 'Người dùng Google',
        avatar_url: picture || 'avatars/default_profile.webp'
      });

      await user.save();
      console.log(`✅ New user created: ${randomUsername}`);
    } else {
      console.log(`✅ User found: ${user.username}`);
    }

    // 5. Cấp phát Token (JWT) của hệ thống mình cho User (Giống hệt login thường)
    const token = jwt.sign(
      { userId: user._id, role: user.status }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Đăng nhập bằng Google thành công!',
      token,
      user: {
        id: user._id,
        username: user.username,
        display_name: user.display_name,
        avatar_url: user.avatar_url
      }
    });

  } catch (error: any) {
    console.error('🚨 Lỗi Google Login:', error?.message || error);
    
    // Trả về lỗi chi tiết hơn cho frontend debug
    const errorMessage = error?.message || 'Lỗi xác thực với Google';
    res.status(500).json({ 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error?.message : undefined
    });
  }
};