import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateAccessToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRE,
    });
};

const generateRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRE,
    });
};

export const createUser = async (name, email, password) => {
    const userExists = await User.findOne({ email });
    if (userExists) {
        const error = new Error('Email already exists');
        error.code = 'EMAIL_ALREADY_EXISTS';
        throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    return user;
};

export const authenticateUser = async (email, password) => {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        const error = new Error('Invalid email or password');
        error.code = 'INVALID_CREDENTIALS';
        throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        const error = new Error('Invalid email or password');
        error.code = 'INVALID_CREDENTIALS';
        throw error;
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await User.findByIdAndUpdate(user._id, { refreshToken });

    return {
        accessToken,
        refreshToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};

export const refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) {
        const error = new Error('Refresh token required');
        error.code = 'REFRESH_TOKEN_REQUIRED';
        throw error;
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const user = await User.findById(decoded.id).select('+refreshToken');

        if (!user || user.refreshToken !== refreshToken) {
            const error = new Error('Invalid refresh token');
            error.code = 'REFRESH_TOKEN_INVALID';
            throw error;
        }

        const newAccessToken = generateAccessToken(user._id);

        return { accessToken: newAccessToken };
    } catch (err) {
        const error = new Error('Invalid refresh token');
        error.code = 'REFRESH_TOKEN_INVALID';
        throw error;
    }
};

export const logoutUser = async (userId) => {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
};

export const getUserById = async (userId) => {
    const user = await User.findById(userId).select('-password');

    if (!user) {
        const error = new Error('User not found');
        error.code = 'USER_NOT_FOUND';
        throw error;
    }

    return user;
};
