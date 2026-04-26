import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import { successResponse, errorResponse } from "../utils/response.js";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ─────────────────────────────────────────────
// [POST] /api/auth/register
// ─────────────────────────────────────────────
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, phone_number, password, display_name } = req.body;

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      errorResponse(res, "Tên đăng nhập đã tồn tại", 400, "DUPLICATE_USERNAME");
      return;
    }

    if (email?.trim()) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        errorResponse(res, "Email này đã tồn tại!", 400, "DUPLICATE_EMAIL");
        return;
      }
    }

    if (phone_number?.trim()) {
      const existingPhone = await User.findOne({ phone_number });
      if (existingPhone) {
        errorResponse(
          res,
          "Số điện thoại này đã tồn tại!",
          400,
          "DUPLICATE_PHONE",
        );
        return;
      }
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email: email?.trim() || null,
      phone_number: phone_number?.trim() || null,
      password_hash,
      display_name: display_name || username,
      status: "active",
      created_at: new Date(),
    });

    await newUser.save();

    successResponse(res, null, "Đăng ký tài khoản thành công!", 201);
  } catch (error: any) {
    console.error("Error:", error);

    if (error.code === 11000) {
      errorResponse(
        res,
        "Dữ liệu đã tồn tại trong hệ thống!",
        400,
        "DUPLICATE_KEY",
      );
    } else if (error.name === "ValidationError") {
      errorResponse(res, error.message, 400, "VALIDATION_ERROR");
    } else {
      errorResponse(
        res,
        "Lỗi server, vui lòng thử lại sau!",
        500,
        "SERVER_ERROR",
      );
    }
  }
};

// ─────────────────────────────────────────────
// [POST] /api/auth/login
// ─────────────────────────────────────────────
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { account, password } = req.body;

    if (!account || !password) {
      errorResponse(
        res,
        "Vui lòng nhập tài khoản và mật khẩu!",
        400,
        "MISSING_CREDENTIALS",
      );
      return;
    }

    const user = await User.findOne({
      $or: [{ email: account }, { phone_number: account }],
    });

    if (!user) {
      errorResponse(
        res,
        "Email hoặc số điện thoại không tồn tại!",
        401,
        "USER_NOT_FOUND",
      );
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      errorResponse(
        res,
        "Tên đăng nhập hoặc mật khẩu không chính xác!",
        401,
        "INVALID_PASSWORD",
      );
      return;
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    successResponse(
      res,
      {
        token,
        user: {
          id: user._id,
          username: user.username,
          display_name: user.display_name,
          email: user.email,
          phone_number: user.phone_number,
          avatar_url: user.avatar_url,
        },
      },
      "Đăng nhập thành công!",
    );
  } catch (error) {
    console.error("Error:", error);
    errorResponse(
      res,
      "Lỗi server, vui lòng thử lại sau!",
      500,
      "SERVER_ERROR",
    );
  }
};

// ─────────────────────────────────────────────
// [POST] /api/auth/google
// ─────────────────────────────────────────────
export const googleLogin = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      errorResponse(res, "Thiếu Google ID Token!", 400, "MISSING_ID_TOKEN");
      return;
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error("GOOGLE_CLIENT_ID chưa được cấu hình");
      errorResponse(
        res,
        "Server chưa cấu hình Google Client ID!",
        500,
        "SERVER_CONFIG_ERROR",
      );
      return;
    }

    let ticket: any;
    try {
      ticket = await client.verifyIdToken({ idToken, audience: clientId });
    } catch (verifyError: any) {
      console.error("Token verification failed:", verifyError?.message);
      errorResponse(
        res,
        "Xác minh token Google thất bại!",
        401,
        "GOOGLE_TOKEN_INVALID",
      );
      return;
    }

    const payload = ticket.getPayload();
    if (!payload?.email) {
      errorResponse(
        res,
        "Không lấy được thông tin từ tài khoản Google!",
        400,
        "GOOGLE_PAYLOAD_MISSING",
      );
      return;
    }

    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      const baseUsername = email.split("@")[0];
      const randomUsername = `${baseUsername}_${Math.floor(Math.random() * 10000)}`;
      const password_hash = await bcrypt.hash(
        Math.random().toString(36).slice(-10),
        10,
      );

      user = new User({
        username: randomUsername,
        email,
        password_hash,
        display_name: name || "Người dùng Google",
        avatar_url: picture || "avatars/default_profile.webp",
        status: "active",
      });

      await user.save();
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    successResponse(
      res,
      {
        token,
        user: {
          id: user._id,
          username: user.username,
          display_name: user.display_name,
          email: user.email,
          avatar_url: user.avatar_url,
        },
      },
      "Đăng nhập bằng Google thành công!",
    );
  } catch (error: any) {
    console.error("Error:", error?.message || error);
    errorResponse(
      res,
      "Lỗi xác thực với Google, vui lòng thử lại!",
      500,
      "SERVER_ERROR",
    );
  }
};