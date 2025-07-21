# Hướng dẫn cài đặt và sử dụng hệ thống quản lý công việc

## 1. Yêu cầu hệ thống

Để chạy được hệ thống quản lý công việc, máy tính cần đảm bảo các yêu cầu sau:

- Node.js phiên bản 14 trở lên
- Trình quản lý gói npm (đi kèm với Node.js)
- MongoDB
- Visual Studio Code
- Docker
- Trình duyệt web hiện đại như Google Chrome hoặc Firefox,..
- Git để clone mã nguồn từ GitHub

---

## 2. Clone mã nguồn từ GitHub

- Mở terminal hoặc Git Bash
- Gõ các lệnh sau:
  - `git clone https://github.com/HuynhKhanhDuy2912/Task_Management.git`
  - `cd Task_Management`

---

## 3. Cài đặt và cấu hình backend

- Truy cập vào thư mục `backend`
  - `cd backend`
- Cài đặt các thư viện cần thiết
  - `npm install`

---

## 4. Khởi chạy ứng dụng bằng Docker

- Quay lại thư mục gốc của dự án (nếu chưa ở đó)
- Chạy lệnh để build và khởi động hệ thống:
  - `docker-compose up --build`

---

## 5. Truy cập và sử dụng ứng dụng

- Backend chạy tại: http://localhost:5000
- Frontend chạy tại: http://localhost:3000

### Các chức năng chính:

- Đăng ký / Đăng nhập tài khoản
- Tạo, xóa danh mục công việc
- Thêm, sửa, xóa công việc
- Nhận thông báo khi công việc đến hạn
- Xem biểu đồ thống kê công việc theo tháng và năm
