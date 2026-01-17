# 🚀 Hướng Dẫn Chạy Full Stack Authentication App

## Tổng Quan

Project gồm 2 phần:
- **Backend**: Node.js + Express + MongoDB (Port 3001)
- **Frontend**: React + TailwindCSS (Port 5173)

## Bước 1: Cài Đặt Backend

```bash
# Di chuyển vào folder backend
cd d:\Node.js\mini_project_Authentication\backend

# Cài đặt dependencies
npm install

# Start backend server
npm run dev
```

**Kết quả mong đợi:**
```
✅ MongoDB Connected: cluster0.zasp2c2.mongodb.net
🚀 Server is running on port 3001
📡 API URL: http://localhost:3001
```

## Bước 2: Cài Đặt Frontend

```bash
# Mở terminal mới, di chuyển vào folder frontend
cd d:\Node.js\mini_project_Authentication\frontend

# Cài đặt dependencies (nếu chưa cài)
npm install

# Start frontend dev server
npm run dev
```

**Kết quả mong đợi:**
```
VITE v7.3.1  ready in 518 ms
➜  Local:   http://localhost:5173/
```

## Bước 3: Test Full Flow

### 3.1 Signup (Đăng ký)

1. Mở browser: `http://localhost:5173/signup`
2. Điền thông tin:
   - Name: Nguyen Van A
   - Email: test@example.com
   - Password: 123456
3. Click "Sign Up"
4. **Kết quả**: Alert "Account created successfully! Please login."
5. **Redirect**: Tự động chuyển về `/login`

### 3.2 Login (Đăng nhập)

1. Ở trang Login, điền:
   - Email: test@example.com
   - Password: 123456
2. Click "Login"
3. **Kết quả**: Redirect về `/home`
4. **Hiển thị**: Trang Home với header, logo, user menu

### 3.3 Protected Route

1. Logout (click user icon → Logout)
2. Thử vào trực tiếp: `http://localhost:5173/home`
3. **Kết quả**: Tự động redirect về `/login`

### 3.4 Token Refresh (Tự động)

1. Login thành công
2. Đợi 15 phút (hoặc manually expire token)
3. Thử thao tác bất kỳ
4. **Kết quả**: Frontend tự động refresh token và retry request

## API Endpoints

Backend cung cấp các endpoints sau:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signup` | POST | Đăng ký tài khoản mới |
| `/api/auth/login` | POST | Đăng nhập |
| `/api/auth/refresh` | POST | Refresh access token |
| `/api/auth/me` | GET | Lấy thông tin user (Protected) |

## Troubleshooting

### Backend không kết nối được MongoDB

**Lỗi**: `MongooseServerSelectionError`

**Giải pháp**:
1. Kiểm tra `MONGODB_URI` trong `.env`
2. Đảm bảo IP của bạn được whitelist trong MongoDB Atlas
3. Kiểm tra internet connection

### Frontend không kết nối được Backend

**Lỗi**: `ERR_CONNECTION_REFUSED`

**Giải pháp**:
1. Đảm bảo backend đang chạy trên port 3001
2. Kiểm tra `baseURL` trong `axiosInstance.js`
3. Tắt firewall/antivirus tạm thời

### CORS Error

**Lỗi**: `Access to XMLHttpRequest has been blocked by CORS policy`

**Giải pháp**:
- Backend đã có `cors()` middleware
- Nếu vẫn lỗi, thêm vào `server.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

## Chuyển Đổi Mock/Real API

### Dùng Mock API (Test không cần backend)

File: `frontend/src/services/api/authService.js`
```javascript
const USE_MOCK_API = true;
```

### Dùng Real API (Kết nối backend thật)

File: `frontend/src/services/api/authService.js`
```javascript
const USE_MOCK_API = false;
```

## Project Structure

```
mini_project_Authentication/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── models/userModel.js
│   │   ├── services/userService.js
│   │   ├── controllers/authController.js
│   │   ├── middleware/authMiddleware.js
│   │   ├── routes/authRoutes.js
│   │   └── server.js
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   └── utils/
    └── package.json
```

## Tính Năng Đã Hoàn Thành

### Backend ✅
- ✅ MongoDB connection
- ✅ User model với password hashing
- ✅ JWT access token (15 phút)
- ✅ JWT refresh token (7 ngày)
- ✅ Signup endpoint
- ✅ Login endpoint
- ✅ Refresh token endpoint
- ✅ Protected routes với middleware
- ✅ CORS enabled

### Frontend ✅
- ✅ Login page
- ✅ Signup page
- ✅ Home page với header
- ✅ Protected routes
- ✅ Auto token refresh
- ✅ Form validation
- ✅ Error handling
- ✅ Responsive design
- ✅ Mock API cho testing

---

**Bắt đầu ngay!** 🎉

1. Terminal 1: `cd backend && npm run dev`
2. Terminal 2: `cd frontend && npm run dev`
3. Browser: `http://localhost:5173`
