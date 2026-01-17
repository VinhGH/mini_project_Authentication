require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const { swaggerDocs } = require('./swagger');

const app = express();

connectDB();

app.use(cors({
    origin: 'http://localhost:3000',
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
