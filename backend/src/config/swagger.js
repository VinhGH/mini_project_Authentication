import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

dotenv.config();

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Authentication API',
            version: '1.0.0',
            description: 'API documentation cho hệ thống xác thực người dùng',
            contact: {
                name: 'API Support',
                email: 'support@example.com',
            },
        },
        servers: [
            {
                url: 'https://mini-project-authentication.onrender.com',
                description: 'Production server (Render)',
            },
            {
                url: 'http://localhost:3001',
                description: 'Development server (Local)',
            },
        ],
        components: {
            schemas: {
                User: {
                    type: 'object',
                    required: ['name', 'email', 'password'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'ID tự động của MongoDB',
                            example: '507f1f77bcf86cd799439012',
                        },
                        name: {
                            type: 'string',
                            description: 'Tên người dùng',
                            example: 'Nguyễn Văn A',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Email người dùng (unique)',
                            example: 'user@example.com',
                        },
                        password: {
                            type: 'string',
                            description: 'Mật khẩu người dùng (hashed)',
                            example: '123456',
                        },
                        role: {
                            type: 'string',
                            enum: ['user', 'admin'],
                            default: 'user',
                            description: 'Vai trò người dùng',
                            example: 'user',
                        },
                        refreshToken: {
                            type: 'string',
                            description: 'Refresh token (không trả về trong response)',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Thời gian tạo',
                            example: '2026-01-11T09:00:00.000Z',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Thời gian cập nhật',
                            example: '2026-01-11T09:00:00.000Z',
                        },
                    },
                },
                UserResponse: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'ID người dùng',
                            example: '507f1f77bcf86cd799439012',
                        },
                        name: {
                            type: 'string',
                            description: 'Tên người dùng',
                            example: 'Nguyễn Văn A',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Email người dùng',
                            example: 'user@example.com',
                        },
                        role: {
                            type: 'string',
                            enum: ['user', 'admin'],
                            description: 'Vai trò người dùng',
                            example: 'user',
                        },
                    },
                },
                SignupInput: {
                    type: 'object',
                    required: ['name', 'email', 'password'],
                    properties: {
                        name: {
                            type: 'string',
                            description: 'Tên người dùng',
                            example: 'Nguyễn Văn A',
                            minLength: 1,
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Email người dùng (phải unique)',
                            example: 'user@example.com',
                        },
                        password: {
                            type: 'string',
                            description: 'Mật khẩu (tối thiểu 6 ký tự)',
                            example: '123456',
                            minLength: 6,
                        },
                    },
                },
                LoginInput: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Email người dùng',
                            example: 'user@example.com',
                        },
                        password: {
                            type: 'string',
                            description: 'Mật khẩu',
                            example: '123456',
                        },
                    },
                },
                LoginResponse: {
                    type: 'object',
                    properties: {
                        accessToken: {
                            type: 'string',
                            description: 'JWT Access Token',
                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                        },
                        user: {
                            $ref: '#/components/schemas/UserResponse',
                        },
                    },
                },
                RefreshTokenResponse: {
                    type: 'object',
                    properties: {
                        accessToken: {
                            type: 'string',
                            description: 'JWT Access Token mới',
                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                        },
                    },
                },
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true,
                        },
                        message: {
                            type: 'string',
                            example: 'Thao tác thành công',
                        },
                        data: {
                            type: 'object',
                            description: 'Dữ liệu trả về',
                        },
                    },
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false,
                        },
                        message: {
                            type: 'string',
                            example: 'Có lỗi xảy ra',
                        },
                        errorCode: {
                            type: 'string',
                            description: 'Mã lỗi cụ thể',
                            example: 'VALIDATION_ERROR',
                            enum: [
                                'VALIDATION_ERROR',
                                'USER_NOT_FOUND',
                                'EMAIL_ALREADY_EXISTS',
                                'INVALID_CREDENTIALS',
                                'TOKEN_EXPIRED',
                                'TOKEN_INVALID',
                                'NOT_AUTHORIZED',
                                'REFRESH_TOKEN_REQUIRED',
                                'REFRESH_TOKEN_INVALID',
                                'FORBIDDEN',
                                'INTERNAL_SERVER_ERROR',
                            ],
                        },
                    },
                },
            },
            responses: {
                ValidationError: {
                    description: 'Dữ liệu đầu vào không hợp lệ - thiếu trường bắt buộc',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse',
                            },
                            examples: {
                                missingFields: {
                                    summary: 'Thiếu trường bắt buộc',
                                    value: {
                                        success: false,
                                        message: 'Please add all fields',
                                        errorCode: 'VALIDATION_ERROR',
                                    },
                                },
                            },
                        },
                    },
                },
                EmailAlreadyExists: {
                    description: 'Email đã tồn tại trong hệ thống',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse',
                            },
                            example: {
                                success: false,
                                message: 'Email already exists',
                                errorCode: 'EMAIL_ALREADY_EXISTS',
                            },
                        },
                    },
                },
                InvalidCredentials: {
                    description: 'Email hoặc mật khẩu không đúng',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse',
                            },
                            example: {
                                success: false,
                                message: 'Invalid credentials',
                                errorCode: 'INVALID_CREDENTIALS',
                            },
                        },
                    },
                },
                Unauthorized: {
                    description: 'Không có quyền truy cập - token không hợp lệ hoặc đã hết hạn',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse',
                            },
                            examples: {
                                noToken: {
                                    summary: 'Không có token',
                                    value: {
                                        success: false,
                                        message: 'Not authorized, no token',
                                        errorCode: 'NOT_AUTHORIZED',
                                    },
                                },
                                invalidToken: {
                                    summary: 'Token không hợp lệ',
                                    value: {
                                        success: false,
                                        message: 'Token invalid',
                                        errorCode: 'TOKEN_INVALID',
                                    },
                                },
                                expiredToken: {
                                    summary: 'Token đã hết hạn',
                                    value: {
                                        success: false,
                                        message: 'Token expired',
                                        errorCode: 'TOKEN_EXPIRED',
                                    },
                                },
                            },
                        },
                    },
                },
                RefreshTokenRequired: {
                    description: 'Refresh token không được cung cấp',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse',
                            },
                            example: {
                                success: false,
                                message: 'Refresh token required',
                                errorCode: 'REFRESH_TOKEN_REQUIRED',
                            },
                        },
                    },
                },
                RefreshTokenInvalid: {
                    description: 'Refresh token không hợp lệ hoặc đã hết hạn',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse',
                            },
                            example: {
                                success: false,
                                message: 'Refresh token invalid',
                                errorCode: 'REFRESH_TOKEN_INVALID',
                            },
                        },
                    },
                },
                UserNotFound: {
                    description: 'Không tìm thấy người dùng',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse',
                            },
                            example: {
                                success: false,
                                message: 'User not found',
                                errorCode: 'USER_NOT_FOUND',
                            },
                        },
                    },
                },
                InternalServerError: {
                    description: 'Lỗi hệ thống',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse',
                            },
                            example: {
                                success: false,
                                message: 'Internal server error',
                                errorCode: 'INTERNAL_SERVER_ERROR',
                            },
                        },
                    },
                },
            },
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT Access Token - Nhận được từ endpoint /api/auth/login hoặc /api/auth/refresh',
                },
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'refreshToken',
                    description: 'Refresh Token được lưu trong HTTP-only cookie',
                },
            },
        },
        tags: [
            {
                name: 'Auth',
                description: 'API xác thực người dùng',
            },
        ],
    },
    apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export const swaggerDocs = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log('📚 Swagger docs available at http://localhost:3001/api-docs');
};
