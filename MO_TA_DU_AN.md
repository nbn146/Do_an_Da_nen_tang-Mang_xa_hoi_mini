# Mini Social App (Web + Mobile + Backend)

## 1. Muc tieu du an

Xay dung ung dung mang xa hoi mini da nen tang (Web va Mobile) cho phep nguoi dung tuong tac voi trai nghiem dong nhat, du lieu dong bo, giao dien toi uu va cap nhat theo thoi gian thuc.

## 2. Cong nghe su dung

- Mobile: React Native (Expo)
- Web: ReactJS (Vite)
- Backend: Node.js + Express
- Co so du lieu: MongoDB
- Realtime: Socket.IO
- Xac thuc: JWT (co the mo rong OAuth2 Google/Facebook)

## 3. Tinh nang chinh

- Dang ky / Dang nhap bang email + mat khau, tra ve JWT
- Newsfeed hien thi bai viet moi nhat
- Dang bai viet gom van ban va hinh anh
- Tuong tac: Like va Comment
- Trang ca nhan: thong tin user + danh sach bai da dang
- Thong bao realtime khi bai viet duoc like/comment
- Tim kiem user va hashtag/noi dung bai viet

## 4. Cau truc monorepo

```
DoAnDanetang/
  backend/                # API + Socket.IO + MongoDB
  web/                    # ReactJS web app
  mobile/                 # React Native Expo app
  docker-compose.yml      # MongoDB local
  MO_TA_DU_AN.md
```

## 5. Kien truc MongoDB

### 5.1 Collection `users`

- `_id`
- `name`
- `email` (unique)
- `password` (hash)
- `avatarUrl`
- `bio`
- `createdAt`, `updatedAt`

### 5.2 Collection `posts`

- `_id`
- `author` (ref `users`)
- `content`
- `imageUrl`
- `hashtags` (mang chuoi)
- `likes` (mang ObjectId user)
- `createdAt`, `updatedAt`

### 5.3 Collection `comments`

- `_id`
- `post` (ref `posts`)
- `user` (ref `users`)
- `text`
- `createdAt`, `updatedAt`

### 5.4 Collection `notifications`

- `_id`
- `recipient` (nguoi nhan)
- `actor` (nguoi tac dong)
- `post` (ref `posts`)
- `type` (`like` | `comment`)
- `message`
- `isRead`
- `createdAt`, `updatedAt`

## 6. Luong dong bo va realtime

1. User dang nhap, client luu JWT.
2. Moi request API gui kem header `Authorization: Bearer <token>`.
3. Sau khi dang nhap, client ket noi Socket.IO va gui su kien `register-user`.
4. Khi co like/comment tren bai viet, backend tao notification trong MongoDB.
5. Backend day su kien `notification:new` den dung user recipient dang online.
6. Web/Mobile cap nhat UI thong bao ngay lap tuc ma khong can tai lai trang.

## 7. API chinh

- Auth
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
- Posts
  - `GET /api/posts/newsfeed`
  - `POST /api/posts` (multipart: content + image)
  - `POST /api/posts/:postId/like`
  - `POST /api/posts/:postId/comment`
- User/Profile
  - `GET /api/users/:userId/profile`
- Notifications
  - `GET /api/notifications`
  - `PATCH /api/notifications/:notificationId/read`
- Search
  - `GET /api/search?q=...`

## 8. Huong dan chay du an

### 8.1 Chay MongoDB

Co 2 cach:

- Dung local MongoDB co san
- Hoac dung Docker:

```bash
docker compose up -d
```

### 8.2 Cai dat dependencies

```bash
npm install
```

### 8.3 Cau hinh backend

Tao file `backend/.env` tu `backend/.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mini_social
JWT_SECRET=replace_with_strong_secret
CLIENT_URL_WEB=http://localhost:5173
CLIENT_URL_MOBILE=http://localhost:8081
```

### 8.4 Chay backend

```bash
npm run dev:backend
```

### 8.5 Chay web

```bash
npm run dev:web
```

### 8.6 Chay mobile

```bash
npm run dev:mobile
```

Luu y mobile:

- Android emulator dung `10.0.2.2` de truy cap backend localhost.
- Neu dung thiet bi that, doi API URL trong `mobile/src/api/client.js` thanh IP LAN may chay backend.

## 9. Ghi chu mo rong

- OAuth2 (Google/Facebook): co the bo sung bang Passport.js.
- Co the mo rong cloud storage (Cloudinary/S3) cho upload anh.
- Co the bo sung Redis cache de tang hieu nang newsfeed.
- Co the trien khai CI/CD, unit test va integration test.
