const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

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
                url: process.env.API_URL,
                description: 'Development server',
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
                            description: 'Mật khẩu người dùng',
                            example: '123456',
                        },
                        role: {
                            type: 'string',
                            enum: ['user', 'admin'],
                            default: 'user',
                            description: 'Vai trò người dùng',
                            example: 'user',
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
                UserInput: {
                    type: 'object',
                    required: ['name', 'email', 'password'],
                    properties: {
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
                        password: {
                            type: 'string',
                            description: 'Mật khẩu',
                            example: '123456',
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
                        },
                    },
                },
            },
            responses: {
                BadRequest: {
                    description: 'Dữ liệu đầu vào không hợp lệ',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse',
                            },
                            example: {
                                success: false,
                                message: 'Dữ liệu không hợp lệ',
                                errorCode: 'VALIDATION_ERROR',
                            },
                        },
                    },
                },
                NotFound: {
                    description: 'Không tìm thấy tài nguyên',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ErrorResponse',
                            },
                            example: {
                                success: false,
                                message: 'Không tìm thấy người dùng',
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
                                message: 'Lỗi hệ thống',
                                errorCode: 'INTERNAL_ERROR',
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

const swaggerDocs = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log('📚 Swagger docs available at http://localhost:3001/api-docs');
};

module.exports = { swaggerDocs };
