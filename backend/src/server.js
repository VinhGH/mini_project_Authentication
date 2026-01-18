import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import { swaggerDocs } from './config/swagger.js';

const app = express();

connectDB();

app.use(cors({
    origin: ['http://localhost:3000', 'https://mini-project-authentication.vercel.app'],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

swaggerDocs(app);

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'Authentication API is running',
        docs: 'http://localhost:3001/api-docs'
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        errorCode: 'INTERNAL_SERVER_ERROR'
    });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API URL: http://localhost:${PORT}`);
    console.log(`API Docs: http://localhost:${PORT}/api-docs`);
});
