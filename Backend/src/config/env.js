import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mini_social",
  jwtSecret: process.env.JWT_SECRET || "dev_secret",
  clientWeb: process.env.CLIENT_URL_WEB || "http://localhost:5173",
  clientMobile: process.env.CLIENT_URL_MOBILE || "http://localhost:8081",
};
