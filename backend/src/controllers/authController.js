const {
    createUser,
    authenticateUser,
    refreshAccessToken,
    logoutUser,
    getUserById,
} = require('../services/userService');
const { success, error } = require('../utils/response');
const { ERROR_CODES } = require('../utils/errorCodes');

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return error(res, 'Please add all fields', 400, ERROR_CODES.VALIDATION_ERROR);
        }

        const user = await createUser(name, email, password);

        return success(
            res,
            'User created successfully',
            {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            201
        );
    } catch (err) {
        if (err.code === 'EMAIL_ALREADY_EXISTS') {
            return error(res, err.message, 409, ERROR_CODES.EMAIL_ALREADY_EXISTS);
        }
        return error(res, err.message, 500, ERROR_CODES.INTERNAL_SERVER_ERROR);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return error(res, 'Please add all fields', 400, ERROR_CODES.VALIDATION_ERROR);
        }

        const { accessToken, refreshToken, user } = await authenticateUser(email, password);

        res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

        return success(res, 'Login successful', {
            accessToken,
            user,
        });
    } catch (err) {
        if (err.code === 'INVALID_CREDENTIALS') {
            return error(res, err.message, 401, ERROR_CODES.INVALID_CREDENTIALS);
        }
        return error(res, err.message, 500, ERROR_CODES.INTERNAL_SERVER_ERROR);
    }
};

const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        const { accessToken } = await refreshAccessToken(refreshToken);

        return success(res, 'Token refreshed successfully', { accessToken });
    } catch (err) {
        if (err.code === 'REFRESH_TOKEN_REQUIRED') {
            return error(res, err.message, 401, ERROR_CODES.REFRESH_TOKEN_REQUIRED);
        }
        if (err.code === 'REFRESH_TOKEN_INVALID') {
            return error(res, err.message, 401, ERROR_CODES.REFRESH_TOKEN_INVALID);
        }
        return error(res, err.message, 500, ERROR_CODES.INTERNAL_SERVER_ERROR);
    }
};

const logout = async (req, res) => {
    try {
        await logoutUser(req.user._id);

        res.clearCookie('refreshToken');

        return success(res, 'Logout successful');
    } catch (err) {
        return error(res, err.message, 500, ERROR_CODES.INTERNAL_SERVER_ERROR);
    }
};

const getMe = async (req, res) => {
    try {
        const user = await getUserById(req.user._id);

        return success(res, 'User retrieved successfully', {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (err) {
        if (err.code === 'USER_NOT_FOUND') {
            return error(res, err.message, 404, ERROR_CODES.USER_NOT_FOUND);
        }
        return error(res, err.message, 500, ERROR_CODES.INTERNAL_SERVER_ERROR);
    }
};

module.exports = {
    signup,
    login,
    refresh,
    logout,
    getMe,
};
