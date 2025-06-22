const User = require('../models/User');
const generateTokens = require('../utils/generateToken');
const jwt = require("jsonwebtoken");

exports.loginAdmin = async ({ email, password }) => {
    const user = await User.findOne({ email });

    if (!user || user.role !== 'admin') {
        const error = new Error('Sai tài khoản hoặc không phải admin');
        error.statusCode = 401;
        throw error;
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        const error = new Error('Mật khẩu sai');
        error.statusCode = 401;
        throw error;
    }

    const { accessToken, refreshToken } = generateTokens(user);
    user.refreshToken = refreshToken;
    await user.save();

    return {
        accessToken,
        refreshToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        }
    };
};

exports.refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) {
        const error = new Error("Không có refresh token");
        error.statusCode = 400;
        throw error;
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
        const error = new Error("Refresh token không hợp lệ");
        error.statusCode = 403;
        throw error;
    }

    let payload;
    try {
        payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
        const error = new Error("Refresh token hết hạn hoặc không hợp lệ");
        error.statusCode = 403;
        throw error;
    }

    // Tạo accessToken mới
    const { accessToken } = generateTokens(user);
    return { accessToken };
};
