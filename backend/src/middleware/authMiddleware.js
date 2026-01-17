const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { error } = require('../utils/response');
const { ERROR_CODES } = require('../utils/errorCodes');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return error(res, 'User not found', 401, ERROR_CODES.USER_NOT_FOUND);
            }

            next();
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return error(res, 'Token expired', 401, ERROR_CODES.TOKEN_EXPIRED);
            }
            return error(res, 'Not authorized, token failed', 401, ERROR_CODES.TOKEN_INVALID);
        }
    }

    if (!token) {
        return error(res, 'Not authorized, no token', 401, ERROR_CODES.NOT_AUTHORIZED);
    }
};

module.exports = { protect };
