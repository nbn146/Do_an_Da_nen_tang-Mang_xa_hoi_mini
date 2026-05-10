import * as Minio from 'minio';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid'; // npm install uuid && npm install -D @types/uuid

// 1. Cấu hình MinIO Client (Nhớ đưa các biến này vào file .env nhé)
// 1. Cấu hình MinIO Client
export const minioClient = new Minio.Client({
  endPoint: 'localhost', 
  port: 9000,
  useSSL: false,
  accessKey: 'admin',         // ⚡️ Đã sửa thành tài khoản thật
  secretKey: 'password123'    // ⚡️ Đã sửa thành mật khẩu thật
});

const BUCKET_NAME = 'social-media-posts';

// 2. Hàm nén WebP và Upload lên MinIO
export const uploadAndCompressImage = async (fileBuffer: Buffer): Promise<string> => {
  // BƯỚC NÉN WEBP: Đổi sang webp và nén chất lượng còn 80%
  const webpBuffer = await sharp(fileBuffer)
    .webp({ quality: 80 }) 
    .toBuffer();

  const fileName = `${uuidv4()}.webp`; // Tạo tên file ngẫu nhiên + đuôi webp

  // Kiểm tra bucket có chưa, chưa có thì tạo mới
  const exists = await minioClient.bucketExists(BUCKET_NAME);
  if (!exists) {
    await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
    // Set policy cho phép public read (để Frontend xem được ảnh)
    const policy = {
      Version: "2012-10-17",
      Statement: [{
        Action: ["s3:GetObject"],
        Effect: "Allow",
        Principal: "*",
        Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`]
      }]
    };
    await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy));
  }

  // BƯỚC UPLOAD
  await minioClient.putObject(BUCKET_NAME, fileName, webpBuffer, webpBuffer.length, {
    'Content-Type': 'image/webp'
  });

  // Trả về URL để lưu vào MongoDB
  return `http://localhost:9000/${BUCKET_NAME}/${fileName}`;
};