import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { error } from "node:console";

export function protect(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  // console.log("=== KIỂM TRA DỮ LIỆU ===");
  // console.log("1. Token nhận được:", token);
  // console.log("2. Secret key:", env.jwtSecret);
  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.userId = decoded.userId;
    return next();
  } catch {
    console.log("Chi tiết lỗi token: ", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
}
