const User = require('../models/User');
const generateTokens = require('../utils/generateToken');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const {sendMail} = require("../utils/mailer");

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
            status: user.status
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

exports.sendResetPasswordEmail = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        const error = new Error("Không tìm thấy người dùng với email này");
        error.statusCode = 404;
        throw error;
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    await sendMail({
        to: user.email,
        subject: 'Yêu cầu đặt lại mật khẩu',
        html: `
            <p>Xin chào ${user.name || "bạn"},</p>
            <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng nhấn vào liên kết bên dưới để đặt lại:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>Liên kết này sẽ hết hạn sau 15 phút.</p>
        `,
    });

    return { message: "Đã gửi email đặt lại mật khẩu" };
};

exports.resetPasswordWithToken = async (token, newPassword) => {
    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        const error = new Error("Token không hợp lệ hoặc đã hết hạn");
        error.statusCode = 400;
        throw error;
    }

    const user = await User.findById(payload.id);
    if (!user) {
        const error = new Error("Người dùng không tồn tại");
        error.statusCode = 404;
        throw error;
    }

    user.password = newPassword;
    await user.save(); // pre('save') sẽ tự hash

    return { message: "Đặt lại mật khẩu thành công" };
};

