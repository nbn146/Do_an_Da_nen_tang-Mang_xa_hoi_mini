import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function protect(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.userId = decoded.userId;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}
