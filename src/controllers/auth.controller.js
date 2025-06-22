const { errorResponse, successResponse } = require('../utils/baseResponse');
const authService = require('../services/auth.service');
const messages = require('../utils/messages');

exports.loginAdmin = async (req, res) => {
    try {
        const result = await authService.loginAdmin(req.body);
        return successResponse(res, messages.auth.loginSuccess, result);
    } catch (err) {
        return errorResponse(res, err.message || messages.auth.loginError, null, err.statusCode || 500);
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const result = await authService.refreshAccessToken(refreshToken);
        return successResponse(res, "Làm mới token thành công", result);
    } catch (err) {
        return errorResponse(res, err.message || "Làm mới token thất bại", null, err.statusCode || 500);
    }
};
