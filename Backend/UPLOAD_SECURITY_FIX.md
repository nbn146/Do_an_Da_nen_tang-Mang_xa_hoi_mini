# 🛡️ Vá Lỗ Hổng Upload File - Chống Tràn RAM

## 📋 Tóm tắt

Đã khắc phục lỗ hổng bảo mật nghiêm trọng trong hệ thống upload file. Trước đây, việc sử dụng `multer({ storage: multer.memoryStorage() })` không có giới hạn dung lượng có thể dẫn đến tràn RAM và crash server.

## ⚠️ Vấn đề trước đây

### Nguy cơ:
- User upload 10 ảnh 4K (mỗi ảnh ~8-10MB) = **80-100MB RAM** cùng lúc
- Nhiều request đồng thời → **RAM overflow** → Server crash
- Không có validation loại file → Có thể upload file nguy hiểm

### Code cũ (KHÔNG AN TOÀN):
```typescript
// ❌ postRoutes.ts - KHÔNG có giới hạn
const upload = multer({ storage: multer.memoryStorage() });
router.post('/createPost', verifyToken, upload.array('images', 5), createPost);

// ❌ userRoutes.ts - KHÔNG có giới hạn
const upload = multer({ storage: multer.memoryStorage() });
router.put('/update', verifyToken, upload.single('avatar'), updateProfile);
```

## ✅ Giải pháp

### 1. Tạo Middleware Tập Trung: `uploadMiddleware.ts`

**Vị trí:** `Backend/src/middleware/uploadMiddleware.ts`

**Tính năng bảo mật:**
- ✅ Giới hạn **5MB/file** (đủ cho ảnh chất lượng cao)
- ✅ Giới hạn **tối đa 5 files/request**
- ✅ Chỉ cho phép **image types**: JPEG, PNG, GIF, WebP
- ✅ Giới hạn **text fields**: 1MB, max 10 fields
- ✅ Validate MIME type chặt chẽ
- ✅ Error handling rõ ràng

**Giới hạn cụ thể:**
```typescript
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;  // 5MB/file
const MAX_FILES = 5;                       // Max 5 files
const MAX_FIELD_SIZE = 1 * 1024 * 1024;   // 1MB cho text fields

limits: {
  fileSize: 5MB,
  files: 5,
  fields: 10,
  fieldSize: 1MB,
  fieldNameSize: 100,
  headerPairs: 2000
}
```

### 2. Export 3 Middleware

```typescript
// 1. Upload 1 ảnh (Avatar, Profile Picture)
export const uploadSingleImage = multer(multerConfig).single('avatar');

// 2. Upload nhiều ảnh (Post, Gallery - max 5)
export const uploadMultipleImages = multer(multerConfig).array('images', MAX_FILES);

// 3. Tùy chỉnh field name
export const createUploadMiddleware = (fieldName: string, maxCount: number = 1)
```

### 3. Cập nhật Routes

#### ✅ postRoutes.ts
```typescript
import { uploadMultipleImages } from '../middleware/uploadMiddleware.js';

// Upload tối đa 5 ảnh với giới hạn 5MB/ảnh
router.post('/createPost', verifyToken, uploadMultipleImages, createPost);
```

#### ✅ userRoutes.ts
```typescript
import { uploadSingleImage } from '../middleware/uploadMiddleware.js';

// Upload avatar với giới hạn 5MB
router.put('/update', verifyToken, uploadSingleImage, updateProfile);
```

#### ✅ conversationRoutes.ts
```typescript
import { createUploadMiddleware } from '../middleware/uploadMiddleware.js';

const uploadMessageFile = createUploadMiddleware('file', 1);

// Upload file trong tin nhắn với giới hạn 5MB
router.post('/:conversationId/messages/upload', uploadMessageFile, sendMessage);
```

## 📊 So sánh Trước/Sau

| Tiêu chí | Trước | Sau |
|----------|-------|-----|
| **Giới hạn file** | ❌ Không có | ✅ 5MB/file |
| **Giới hạn số file** | ⚠️ Chỉ logic (5 files) | ✅ Middleware enforce (5 files) |
| **Validate MIME** | ❌ Không có | ✅ Chỉ cho phép ảnh |
| **Max RAM/request** | ❌ Không giới hạn (có thể 100MB+) | ✅ 25MB (5 files × 5MB) |
| **Bảo mật** | ❌ Thấp | ✅ Cao |
| **Tập trung hóa** | ❌ Rải rác 3 files | ✅ 1 file duy nhất |

## 🔧 Files Đã Thay Đổi

### Tạo mới:
- ✅ `Backend/src/middleware/uploadMiddleware.ts` - Middleware bảo mật mới

### Cập nhật:
- ✅ `Backend/src/routes/postRoutes.ts` - Sử dụng `uploadMultipleImages`
- ✅ `Backend/src/routes/userRoutes.ts` - Sử dụng `uploadSingleImage`
- ✅ `Backend/src/routes/conversationRoutes.ts` - Sử dụng `createUploadMiddleware`

### Backup:
- 📦 `Backend/src/middleware/upload.ts` → `upload.ts.backup` (không dùng nữa)

## 🎯 Lợi ích

1. **Chống RAM overflow**: Max 25MB/request thay vì không giới hạn
2. **Bảo mật cao hơn**: Chỉ cho phép ảnh, không cho file nguy hiểm (PDF, ZIP, EXE...)
3. **Tập trung hóa**: Tất cả logic upload ở 1 file duy nhất
4. **Dễ maintain**: Muốn thay đổi giới hạn chỉ sửa 1 chỗ
5. **Error handling tốt**: Message lỗi rõ ràng cho user
6. **Performance**: Giảm tải RAM, server ổn định hơn

## 🚀 Cách Sử Dụng

### Upload 1 ảnh:
```typescript
import { uploadSingleImage } from '../middleware/uploadMiddleware.js';

router.put('/profile', verifyToken, uploadSingleImage, updateProfile);
// Field name: 'avatar'
```

### Upload nhiều ảnh:
```typescript
import { uploadMultipleImages } from '../middleware/uploadMiddleware.js';

router.post('/post', verifyToken, uploadMultipleImages, createPost);
// Field name: 'images', max 5 files
```

### Upload với field name tùy chỉnh:
```typescript
import { createUploadMiddleware } from '../middleware/uploadMiddleware.js';

const uploadCustom = createUploadMiddleware('myField', 3);
router.post('/custom', verifyToken, uploadCustom, handler);
// Field name: 'myField', max 3 files
```

## ⚙️ Tùy chỉnh Giới hạn

Nếu cần thay đổi giới hạn, chỉnh sửa trong `uploadMiddleware.ts`:

```typescript
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;  // Thay đổi ở đây
const MAX_FILES = 5;                       // Thay đổi ở đây
```

## 📝 Ghi chú

- Middleware vẫn sử dụng `memoryStorage()` vì Sharp cần buffer để nén ảnh
- Giới hạn 5MB/file là đủ cho ảnh chất lượng cao (4K)
- Sau khi Sharp nén, ảnh sẽ nhỏ hơn nhiều (~500KB - 1MB)
- File cũ `upload.ts` đã được backup, có thể xóa sau khi test kỹ

## ✅ Checklist Hoàn thành

- [x] Tạo `uploadMiddleware.ts` với giới hạn bảo mật
- [x] Export `uploadSingleImage` và `uploadMultipleImages`
- [x] Cập nhật `postRoutes.ts`
- [x] Cập nhật `userRoutes.ts`
- [x] Cập nhật `conversationRoutes.ts`
- [x] Backup file cũ `upload.ts`
- [x] Tạo tài liệu hướng dẫn

---

**Ngày thực hiện:** 18/05/2026  
**Mức độ ưu tiên:** 🔴 Critical Security Fix  
**Trạng thái:** ✅ Hoàn thành
