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
    
    // fixx lỗi nếu có 2 tài khoản đăng nhập bằng sdt, khi đó email đều hiện là underfined và báo lỗi email trùng lặp

    const conditions: any[] = [{ username }];

    if (email && email.trim() !== "") {
      conditions.push({ email });
    }
    if (phone_number && phone_number.trim() !== "") {
      conditions.push({ phone_number });
    }


    

    // Kiểm tra trùng lặp Tên đăng nhập
    const existingUsername = await User.findOne({ $or: conditions });
    if (existingUsername) {
      let field = "Tên đăng nhập";
      if (existingUsername.email === email) field = "Email";
      if (existingUsername.phone_number === phone_number) field = "Số điện thoại";
      res.status(400).json({ 
        success: false,
        message: 'Tên đăng nhập, Email hoặc Số điện thoại đã tồn tại!'
       });
      return;
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
  
  password_hash,
  display_name: display_name || username,
  
  // 2 Trường bắt buộc theo Schema của Toản:
  status: 'active', // Hoặc 'pending' tùy logic của bạn
  created_at: new Date() 
});

    await newUser.save();
    console.log("🎉 4. LƯU THÀNH CÔNG VÀO MONGODB!");

    res.status(201).json({ 
      success: true,
      message: 'Đăng ký tài khoản thành công!',
      data :{
        username: newUser.username,
        id: newUser._id,
        display_name: newUser.display_name,
        email: newUser.email,
        phone_number: newUser.phone_number
       }
       });

  } catch (error: any) {
    console.error('🚨 Lỗi Register:', error);
    // CAMERA GIÁM SÁT LỖI MONGODB:
    res.status(500).json({
      success: false,
      message: error.name === "Validator Error "? error.message:"Lỗi Server không xác định !!"
    })
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Frontend gửi lên trường tên là 'username', nhưng thực chất nó có thể là email hoặc số điện thoại
    const { account , password } = req.body;

    if (!account || !password) {
      res.status(400).json({ 
        success: false,
        message: "Vui lòng nhập tài khoản và mật khẩu"
       });
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
    if (!user ) {
      res.status(401).json({ 
        success: false,
        message: 'Thông tin đăng nhập không chính xác !!' });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Mật khẩu không chính xác!' });
      return;
    }

    const token = jwt.sign(
      { userId: user._id }, 
      JWT_SECRET , 
      { expiresIn: '7d' }
    );

    res.status(200).json({
      succes: true,
      message: 'Đăng nhập thành công!',
      data: {
        token,
        id: user._id,
        username: user.username,
        display_name: user.display_name,
        email: user.email,
        phone_number: user.phone_number
      }
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Lỗi Server khi đăng nhập!!' });
  }
};


// [POST] /api/auth/google
export const googleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("🚀 Đang xử lý đăng nhập GOOGLE"); //
    const { idToken } = req.body;
    if (!idToken) {
      res.status(400).json({
        success: false,
        message: 'Thiếu Google ID Token!' });
      return;
    }

    const audience = process.env.GOOGLE_CLIENT_ID;
    if (!audience) {
      res.status(500).json({
        success: false,
        message: 'Google Client ID not configured' });
      return;
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience,
    });

    const payload = ticket.getPayload();
    
    if (!payload || !payload.email) {
      res.status(400).json({ 
        sucess: false,
        message: 'Xác thực Google thất bại' });
      return;
    }

    let user = await User.findOne({ email: payload.email })

    if (!user) {
      const password_hash = await bcrypt.hash(Math.random().toString(36), 10);
      user = new User({
        username: `${payload.email.split('@')[0]}_${Math.random().toString(36).slice(-4)}`,
        email: payload.email,
        password_hash: password_hash,
        display_name: payload.name,
        avatar_url: payload.picture,
        status:"active"
      });

      await user.save();
    }

    // 5. Cấp phát Token (JWT) của hệ thống mình cho User (Giống hệt login thường)
    const token = jwt.sign(
      { userId: user._id }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
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
    res.status(401).json({
      success: false,
      message: 'Token xác minh thất bại từ Google'
    })
  } 
};