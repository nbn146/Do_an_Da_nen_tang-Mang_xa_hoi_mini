import type { Request, Response } from "express";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js"; // Import Route vừa tạo
import * as middleware from "i18next-http-middleware";
import i18next from "./config/i18n.js";

dotenv.config(); // Đọc file .env

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// Middleware phải được setup trước các routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GẮN CÁC ĐƯỜNG DẪN API VÀO ĐÂY

app.use(middleware.handle(i18next));

app.use("/api/auth", authRoutes);



app.get("/api/test", (req: Request, res: Response) => {
  res.status(200).json({ message: "MiniSocial API đang chạy mượt mà! 🚀" });
});

// Catch-all route cho 404 errors
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route không tồn tại", path: req.path });
});

// Bắt đầu server ngay lập tức
const server = app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});

// Kết nối MongoDB (không phải chặn server)
mongoose
  .connect(MONGO_URI as string)
  .then(() => {
    console.log("✅ Đã kết nối thành công tới MongoDB!");
  })
  .catch((err) => {
    console.error("❌ Lỗi kết nối Database:", err);
  });
