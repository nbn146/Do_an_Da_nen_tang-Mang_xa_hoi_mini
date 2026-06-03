import multer from 'multer';
import type { Request } from 'express';

// ==========================================
// CẤU HÌNH BẢO MẬT CHO UPLOAD
// ==========================================

/**
 * Giới hạn dung lượng file để chống tràn RAM
 * - Mỗi file tối đa 5MB (đủ cho ảnh chất lượng cao)
 * - Tổng request không quá 25MB (5 files × 5MB)
 */
const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 5; // Tối đa 5 ảnh/request
const MAX_FIELD_SIZE = 1 * 1024 * 1024; // 1MB cho text fields

/**
 * Chỉ cho phép các loại ảnh an toàn
 * Loại bỏ các file nguy hiểm như PDF, ZIP, executable...
 */
const ALLOWED_IMAGE_MIMETYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
];

const ALLOWED_MESSAGE_FILE_MIMETYPES = [
  ...ALLOWED_IMAGE_MIMETYPES,
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/zip',
];

// ==========================================
// FILE FILTER - KIỂM TRA LOẠI FILE
// ==========================================

/**
 * Hàm kiểm tra file có hợp lệ không
 * - Chỉ chấp nhận ảnh (JPEG, PNG, GIF, WebP)
 * - Reject tất cả các loại file khác
 */
const imageFileFilter: multer.Options['fileFilter'] = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (ALLOWED_IMAGE_MIMETYPES.includes(file.mimetype)) {
    // File hợp lệ
    cb(null, true);
  } else {
    // File không hợp lệ - reject
    cb(
      new Error(
        `Loại file không được hỗ trợ: ${file.mimetype}. Chỉ chấp nhận: ${ALLOWED_IMAGE_MIMETYPES.join(', ')}`
      )
    );
  }
};

const messageFileFilter: multer.Options['fileFilter'] = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (ALLOWED_MESSAGE_FILE_MIMETYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Loáº¡i file khÃ´ng Ä‘Æ°á»£c há»— trá»£: ${file.mimetype}.`
      )
    );
  }
};

// ==========================================
// MULTER CONFIGURATION
// ==========================================

/**
 * Cấu hình Multer với memoryStorage
 * - Dùng RAM để lưu tạm (cần thiết cho Sharp xử lý buffer)
 * - Có giới hạn chặt chẽ để tránh tràn RAM
 */
const multerConfig: multer.Options = {
  storage: multer.memoryStorage(),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: FILE_SIZE_LIMIT, // 5MB/file
    files: MAX_FILES, // Max 5 files
    fields: 10, // Giới hạn số lượng text fields
    fieldSize: MAX_FIELD_SIZE, // 1MB cho mỗi text field
    fieldNameSize: 100, // Max 100 ký tự cho tên field
    headerPairs: 2000, // Giới hạn số header pairs
  },
};

// ==========================================
// EXPORT MIDDLEWARE
// ==========================================

/**
 * Middleware cho upload 1 ảnh (Avatar, Profile Picture...)
 * - Sử dụng cho: userRoutes (update avatar)
 * - Field name: 'avatar' hoặc tùy chỉnh
 */
export const uploadSingleImage = multer(multerConfig).single('avatar');

/**
 * Middleware cho upload nhiều ảnh (Post, Gallery...)
 * - Sử dụng cho: postRoutes (create post với nhiều ảnh)
 * - Field name: 'images'
 * - Max: 5 ảnh/request
 */
export const uploadMultipleImages = multer(multerConfig).array('images', MAX_FILES);

/**
 * Middleware linh hoạt - có thể tùy chỉnh field name
 * Sử dụng khi cần upload với field name khác
 */
export const createUploadMiddleware = (
  fieldName: string,
  maxCount: number = 1,
  allowMessageFiles = false,
) => {
  const config = allowMessageFiles
    ? { ...multerConfig, fileFilter: messageFileFilter }
    : multerConfig;

  if (maxCount === 1) {
    return multer(config).single(fieldName);
  }
  return multer(config).array(fieldName, Math.min(maxCount, MAX_FILES));
};

// Export constants để sử dụng ở nơi khác nếu cần
export const UPLOAD_LIMITS = {
  FILE_SIZE_LIMIT,
  MAX_FILES,
  MAX_FIELD_SIZE,
  ALLOWED_IMAGE_MIMETYPES,
  ALLOWED_MESSAGE_FILE_MIMETYPES,
};
