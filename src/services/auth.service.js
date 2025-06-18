const User = require('../models/User');
const generateTokens = require('../utils/generateToken');

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
