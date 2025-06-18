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
