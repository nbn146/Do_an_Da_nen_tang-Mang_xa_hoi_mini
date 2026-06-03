# BÁO CÁO ĐỒ ÁN MÔN HỌC

## PHẦN MỞ ĐẦU

### Trang bìa & Trang phụ bìa
- **Tên trường:** [Điền tên trường của bạn]
- **Khoa:** [Điền tên khoa của bạn]
- **Tên đề tài:** Xây dựng ứng dụng Mạng Xã Hội Mini đa nền tảng (Web & Mobile)
- **Giảng viên hướng dẫn:** [Điền tên giảng viên hướng dẫn]
- **Sinh viên thực hiện:** Trương Quốc Toản - Mã SV: 0214168

### Lời cảm ơn và Lời cam đoan
- **Lời cảm ơn:** Em xin gửi lời cảm ơn chân thành đến giảng viên hướng dẫn đã tận tình chỉ bảo, cung cấp những kiến thức quý báu và định hướng cho em trong suốt quá trình thực hiện đề tài này.
- **Lời cam đoan:** Em xin cam đoan đây là công trình nghiên cứu và phát triển của bản thân. Các đoạn code, thư viện tham khảo đều được trích dẫn và sử dụng hợp lệ. Mọi kết quả trong báo cáo là trung thực.

### Mục lục, Danh mục hình vẽ, Danh mục bảng biểu
- **Mục lục:**
  1. Chương 1: Tổng quan (Introduction)
  2. Chương 2: Cơ sở lý thuyết và Công nghệ (Background)
  3. Chương 3: Phân tích và Thiết kế hệ thống (Analysis & Design)
  4. Chương 4: Xây dựng và Cài đặt ứng dụng (Implementation)
  5. Chương 5: Kết luận và Hướng phát triển
  - Tài liệu tham khảo và Phụ lục
- **Danh mục hình vẽ:**
  - Hình 3.1: Biểu đồ Use Case tổng quát
  - Hình 3.2: Biểu đồ Sequence (Tuần tự) chức năng Đăng bài
  - Hình 3.3: Mô hình thực thể liên kết (ERD)
  - Hình 3.4: Sơ đồ luồng màn hình (Wireframe/Mockup)
- **Danh mục bảng biểu:**
  - Bảng 4.1: Các kịch bản kiểm thử (Test cases)

---

## 1. Chương 1: Tổng quan (Introduction)

### Lý do chọn đề tài
Trong thời đại số hóa hiện nay, mạng xã hội đã trở thành một phần không thể thiếu trong cuộc sống, giúp con người kết nối, chia sẻ thông tin và tương tác với nhau bất chấp khoảng cách địa lý. Tuy nhiên, việc xây dựng một hệ thống đồng nhất trên cả nền tảng Web và Mobile với khả năng đồng bộ dữ liệu theo thời gian thực luôn là một bài toán thú vị và thách thức. Đề tài "Mini Social App" được lựa chọn nhằm giải quyết vấn đề xây dựng một ứng dụng đa nền tảng mang lại trải nghiệm mượt mà, nhất quán cho người dùng.

### Mục tiêu đề tài
Xây dựng một ứng dụng mạng xã hội thu nhỏ (Mini Social) hoạt động trơn tru trên cả hai nền tảng Web và Mobile. Ứng dụng cung cấp các tính năng cốt lõi của một mạng xã hội hiện đại như:
- Đăng tải trạng thái (văn bản, hình ảnh).
- Tương tác với bài viết (Like, Comment).
- Cập nhật thông báo theo thời gian thực (Real-time).
- Trải nghiệm đồng nhất và dữ liệu được đồng bộ hóa tức thời giữa các thiết bị.

### Phạm vi nghiên cứu
- **Chức năng:** Tập trung vào các nghiệp vụ chính bao gồm Quản lý tài khoản (Auth), Bảng tin (Newsfeed), Đăng bài, Tương tác (Like/Comment), Thông báo thời gian thực và Tìm kiếm cơ bản.
- **Nền tảng hỗ trợ:** Trình duyệt Web (Desktop/Mobile Web) và Ứng dụng di động (Android/iOS).

---

## 2. Chương 2: Cơ sở lý thuyết và Công nghệ (Background)

### Công nghệ sử dụng
Dự án áp dụng các công nghệ hiện đại và phổ biến trong hệ sinh thái JavaScript:
- **Ngôn ngữ lập trình:** JavaScript/TypeScript.
- **Mobile Framework:** `React Native` thông qua framework `Expo`, cho phép code một lần và chạy trên cả Android lẫn iOS.
- **Web Framework:** `ReactJS` kết hợp với build tool `Vite` giúp ứng dụng nhẹ, tốc độ phản hồi nhanh.
- **Backend Framework:** `Node.js` cùng framework `Express.js` để xây dựng RESTful APIs.
- **Database (Cơ sở dữ liệu):** `MongoDB` - hệ quản trị CSDL NoSQL linh hoạt, phù hợp với cấu trúc dữ liệu mạng xã hội.
- **Real-time:** Sử dụng `Socket.IO` để xử lý WebSockets, cho phép đẩy thông báo (push notifications).
- **IDE (Môi trường phát triển):** Visual Studio Code (VS Code).

### Kiến trúc hệ thống
Hệ thống được thiết kế theo mô hình **Client - Server**:
1. **Client Tier (Front-end):** Gồm Web App và Mobile App, có nhiệm vụ render giao diện, xử lý UI/UX và gọi API.
2. **Server Tier (Back-end):** Node.js chịu trách nhiệm xử lý nghiệp vụ, kiểm tra phân quyền, điều phối luồng dữ liệu, xử lý REST API và các kết nối WebSocket.
3. **Data Tier (Database):** MongoDB lưu trữ dữ liệu.
Cấu trúc mã nguồn được phân tách theo mô hình **MVC (Model - View - Controller)** trên Server, trong đó View được tách biệt hoàn toàn làm các ứng dụng Client độc lập.

---

## 3. Chương 3: Phân tích và Thiết kế hệ thống (Analysis & Design)

### Yêu cầu hệ thống
- **Yêu cầu chức năng (Functional):**
  - Đăng ký, đăng nhập tài khoản an toàn qua email/password.
  - Xem danh sách bài viết trên Newsfeed.
  - Tạo bài viết mới có đính kèm văn bản và hình ảnh.
  - Tương tác trực tiếp: Thích (Like) và Bình luận (Comment) bài viết.
  - Quản lý trang cá nhân (Profile): Cập nhật thông báo cá nhân, xem các bài đã đăng.
  - Nhận thông báo realtime ngay lập tức khi có người tương tác với bài viết của mình.
  - Tìm kiếm bài viết/người dùng.

- **Yêu cầu phi chức năng (Non-functional):**
  - **Hiệu năng:** Tốc độ load Newsfeed nhanh, hình ảnh được tối ưu hóa.
  - **Tính khả dụng:** UI/UX thân thiện, Responsive trên mọi kích thước màn hình Web và Native trên Mobile.
  - **Bảo mật:** Mật khẩu phải được hash (bcrypt), API cần xác thực Bearer Token (JWT).

### Biểu đồ Use Case và Sequence

#### Biểu đồ Use Case
- **Guest (Khách):** Đăng ký, Đăng nhập.
- **User (Người dùng):** Xem bảng tin, Đăng bài, Tương tác (Like/Comment), Xem thông báo, Tìm kiếm.

> **[CHÈN ẢNH BIỂU ĐỒ USE CASE VÀO KHOẢNG TRỐNG NÀY]**
<br><br><br><br><br>

#### Biểu đồ Sequence (Tuần tự)
*Sơ đồ tuần tự thể hiện luồng xử lý của các chức năng chính như Đăng nhập, Đăng bài, Like/Comment theo thời gian thực.*

> **[CHÈN ẢNH BIỂU ĐỒ SEQUENCE VÀO KHOẢNG TRỐNG NÀY]**
<br><br><br><br><br>

### Thiết kế cơ sở dữ liệu
Mô hình thực thể liên kết (ERD) và Lược đồ cơ sở dữ liệu bao gồm 4 collection chính được liên kết tham chiếu:
1. **Users (`users`):** `_id`, `name`, `email`, `password` (hashed), `avatarUrl`, `bio`.
2. **Posts (`posts`):** `_id`, `author` (ref users), `content`, `imageUrl`, `hashtags`, `likes` (array ObjectID).
3. **Comments (`comments`):** `_id`, `post` (ref posts), `user` (ref users), `text`.
4. **Notifications (`notifications`):** `_id`, `recipient`, `actor`, `post`, `type` (like/comment), `message`, `isRead`.

> **[CHÈN ẢNH ERD / LƯỢC ĐỒ CƠ SỞ DỮ LIỆU VÀO KHOẢNG TRỐNG NÀY]**
<br><br><br><br><br>

### Thiết kế giao diện
Sơ đồ luồng màn hình (Wireframe/Mockup) cơ bản:
- `Màn hình Đăng nhập/Đăng ký` -> `Màn hình Bảng tin (Home/Newsfeed)`
- Từ `Newsfeed` -> `Màn hình Đăng bài (Create Post)` hoặc `Màn hình Chi tiết bài viết (Post Detail / Comments)`.
- Thanh điều hướng (Navbar/Bottom Tab) đi tới: `Bảng tin`, `Tìm kiếm`, `Thông báo`, `Hồ sơ cá nhân`.

> **[CHÈN ẢNH WIREFRAME/MOCKUP GIAO DIỆN VÀO KHOẢNG TRỐNG NÀY]**
<br><br><br><br><br>

---

## 4. Chương 4: Xây dựng và Cài đặt ứng dụng (Implementation)

### Môi trường triển khai
- **Cấu hình phần cứng:** Máy tính có RAM tối thiểu 8GB (khuyến nghị 16GB để chạy giả lập Mobile), CPU Core i5/Ryzen 5 trở lên.
- **Cấu hình phần mềm:** Node.js (v18+), Docker & Docker Compose (cho MongoDB), IDE Visual Studio Code, Git.
- **Môi trường Mobile:** Android Emulator (Android Studio) hoặc ứng dụng Expo Go trên thiết bị vật lý.

### Hiện thực hóa
- **Backend:** 
  - Khởi tạo Express Server.
  - Kết nối MongoDB qua Mongoose. 
  - Các Middleware xác thực JWT được áp dụng để bảo vệ REST APIs. 
  - Cấu hình Socket.IO: Lắng nghe sự kiện `register-user` từ client và phát (emit) sự kiện `notification:new` trực tiếp đến các client đang online khi có tương tác (like/comment).
- **Frontend (Web & Mobile):** 
  - Sử dụng React và React Native (Expo). 
  - Quản lý trạng thái (State Management) với Context API.
  - Giao tiếp với API qua Axios, tự động đính kèm JWT token. 
  - Giao diện (UI) sử dụng các component tái sử dụng.

> **[CHÈN ẢNH GIAO DIỆN CÁC MÀN HÌNH QUAN TRỌNG HOẶC ĐOẠN CODE CHÍNH VÀO KHOẢNG TRỐNG NÀY]**
<br><br><br><br><br>

### Kiểm thử (Testing)
Các kịch bản test (Test cases) cơ bản đã được thực hiện:
- **Đăng nhập/Đăng ký:** Kiểm tra xác thực email hợp lệ, kiểm tra hash mật khẩu, kiểm tra token trả về đúng.
- **API (Postman):** Gửi request tạo bài viết, lấy danh sách bảng tin và đảm bảo dữ liệu trả về đúng JSON format và mã trạng thái (200/201).
- **Real-time (Socket.IO):** Mở 2 cửa sổ, tài khoản A thả tim bài viết của tài khoản B, tài khoản B hiển thị thông báo chưa đọc tăng lên 1 ngay lập tức mà không cần tải lại trang.
- **Đa nền tảng:** Đảm bảo bài viết, hình ảnh hiển thị nhất quán, không bị vỡ layout trên cả trình duyệt Web và ứng dụng di động.

---

## 5. Chương 5: Kết luận và Hướng phát triển

### Đánh giá
**Mức độ hoàn thành:** Ứng dụng đã hoàn thiện và đáp ứng được khoảng 90% mục tiêu đề ra ban đầu về một mạng xã hội mini đa nền tảng thời gian thực.
- **Ưu điểm:**
  - Hoạt động mượt mà trên cả Web và Mobile nhờ ứng dụng hệ sinh thái React.
  - Cập nhật dữ liệu thời gian thực tốt nhờ kiến trúc Socket.IO hoạt động hiệu quả.
  - Cấu trúc thư mục (Monorepo) rõ ràng, API thiết kế chuẩn RESTful.
- **Nhược điểm/Hạn chế:**
  - Chưa có tính năng chat riêng tư giữa người dùng.
  - Chưa tối ưu lưu trữ hình ảnh trên Cloud thực tế (như AWS S3) để đáp ứng lượng dữ liệu lớn, hiện tại vẫn lưu trữ qua dịch vụ cơ bản.

### Hướng phát triển
Các tính năng dự kiến mở rộng trong tương lai:
- Bổ sung hệ thống nhắn tin cá nhân (Private Chat 1-on-1).
- Hỗ trợ đăng nhập một chạm qua mạng xã hội khác như Google, Facebook (OAuth2).
- Tích hợp Redis để tối ưu hóa bộ nhớ đệm (cache) cho Newsfeed, tăng tốc độ truy xuất.
- Bổ sung chức năng kiểm duyệt nội dung tự động dựa trên từ khóa.

---

## Tài liệu tham khảo và Phụ lục

**Tài liệu tham khảo:**
1. Tài liệu chính thức ReactJS & React Native: https://react.dev, https://reactnative.dev
2. Tài liệu Expo: https://docs.expo.dev
3. Hướng dẫn sử dụng Express.js: https://expressjs.com
4. Tài liệu MongoDB & Mongoose: https://mongoosejs.com
5. Socket.IO Documentation: https://socket.io/docs/v4/

**Phụ lục:**
- Mã nguồn dự án được lưu trữ tại thư mục dự án `miniSocial`.
- File danh sách chi tiết các kịch bản kiểm thử (Test cases): `MiniSocial_TestCases.xlsx` đính kèm trong thư mục gốc.
