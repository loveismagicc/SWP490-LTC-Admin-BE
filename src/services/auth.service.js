const User = require('../models/User');
const generateTokens = require('../utils/generateToken');
const jwt = require("jsonwebtoken");

exports.loginAdmin = async ({ email, password }) => {
    const user = await User.findOne({ email });

    if (!user || (user.role !== 'admin'  && user.role !== 'hotel_owner' && user.role !== 'tour_provider')) {
        const error = new Error('Tài khoản không có quyền truy cập');
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

    let payload;
    try {
        payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
        const error = new Error("Refresh token hết hạn hoặc không hợp lệ");
        error.statusCode = 403;
        throw error;
    }

    const user = await User.findById(payload.id);
    if (!user) {
        const error = new Error("Không tìm thấy người dùng");
        error.statusCode = 404;
        throw error;
    }

    const { accessToken } = generateTokens(user);
    return { accessToken };
};

