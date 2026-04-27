import type { Request, Response } from "express";

export const successResponse = (
  req: Request,       // 👈 Bổ sung req vào đây
  res: Response,
  data: any = null,
  messageKey = "common.SUCCESS", // 👈 Đổi tên biến thành messageKey cho đúng bản chất
  status = 200,
  meta: any = null,
) => {
  // Lấy hàm dịch 't' từ request. Ép kiểu any để tránh lỗi TypeScript.
  const t = (req as any).t;
  
  // Dịch key sang text. Nếu không có hàm t hoặc không tìm thấy key, giữ nguyên key gốc.
  const translatedMessage = t ? t(messageKey) : messageKey;

  return res.status(status).json({
    success: true,
    message: translatedMessage, // 👈 Trả về chuỗi đã được dịch (VD: "Đăng nhập thành công")
    data,
    ...(meta && { meta }),
  });
};

export const errorResponse = (
  req: Request,       // 👈 Bổ sung req vào đây
  res: Response,
  messageKey = "common.SERVER_ERROR", // 👈 Nhận key từ file JSON
  status = 500,
  error = "SERVER_ERROR", // Mã lỗi nguyên bản (giữ nguyên để debug)
) => {
  const t = (req as any).t;
  const translatedMessage = t ? t(messageKey) : messageKey;

  return res.status(status).json({
    success: false,
    message: translatedMessage, // 👈 Trả về chuỗi lỗi đã dịch (VD: "Mật khẩu sai")
    error,
  });
};