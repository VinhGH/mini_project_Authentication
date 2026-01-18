import express from 'express';
const router = express.Router();
import {
    signup,
    login,
    refresh,
    logout,
    getMe,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     description: Tạo tài khoản người dùng mới với email, tên và mật khẩu. Email phải unique và chưa tồn tại trong hệ thống.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupInput'
 *           examples:
 *             validSignup:
 *               summary: Đăng ký hợp lệ
 *               value:
 *                 name: Nguyễn Văn A
 *                 email: user@example.com
 *                 password: "123456"
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439012
 *                     name:
 *                       type: string
 *                       example: Nguyễn Văn A
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       409:
 *         $ref: '#/components/responses/EmailAlreadyExists'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/signup', signup);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập
 *     description: Xác thực người dùng bằng email và mật khẩu. Trả về access token (JWT) và lưu refresh token vào HTTP-only cookie.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *           examples:
 *             validLogin:
 *               summary: Đăng nhập hợp lệ
 *               value:
 *                 email: user@example.com
 *                 password: "123456"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         headers:
 *           Set-Cookie:
 *             description: Refresh token được lưu trong HTTP-only cookie
 *             schema:
 *               type: string
 *               example: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 data:
 *                   $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/InvalidCredentials'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Làm mới access token
 *     description: Sử dụng refresh token từ cookie để tạo access token mới. Refresh token phải hợp lệ và chưa hết hạn.
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: cookie
 *         name: refreshToken
 *         required: true
 *         schema:
 *           type: string
 *         description: Refresh token được lưu trong HTTP-only cookie
 *     responses:
 *       200:
 *         description: Làm mới token thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Token refreshed successfully
 *                 data:
 *                   $ref: '#/components/schemas/RefreshTokenResponse'
 *       401:
 *         description: Refresh token không hợp lệ hoặc không được cung cấp
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               tokenRequired:
 *                 summary: Thiếu refresh token
 *                 value:
 *                   success: false
 *                   message: Refresh token required
 *                   errorCode: REFRESH_TOKEN_REQUIRED
 *               tokenInvalid:
 *                 summary: Refresh token không hợp lệ
 *                 value:
 *                   success: false
 *                   message: Refresh token invalid
 *                   errorCode: REFRESH_TOKEN_INVALID
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/refresh', refresh);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Đăng xuất
 *     description: Xóa refresh token khỏi database và xóa cookie. Yêu cầu access token hợp lệ.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         description: JWT Access Token với format "Bearer {token}"
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 *         headers:
 *           Set-Cookie:
 *             description: Xóa refresh token cookie
 *             schema:
 *               type: string
 *               example: refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logout successful
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/logout', protect, logout);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Lấy thông tin người dùng hiện tại
 *     description: Trả về thông tin chi tiết của người dùng đang đăng nhập dựa trên access token. Yêu cầu xác thực bằng JWT.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         description: JWT Access Token với format "Bearer {token}"
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/UserResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/UserNotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/me', protect, getMe);

export default router;
