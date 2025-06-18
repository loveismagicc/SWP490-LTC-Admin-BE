const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/baseResponse');
const messages = require('../utils/messages');


exports.protectAdmin = async (req, res, next) => {
    let token;

    try {
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                return errorResponse(res, messages.user.notFound, null, 401);
            }

            if (user.role !== 'admin') {
                return errorResponse(res, messages.auth.unauthorized, null, 403);
            }

            req.user = user;
            next();
        } else {
            return errorResponse(res, messages.auth.tokenMissing, null, 401);
        }
    } catch (err) {
        return errorResponse(res, messages.auth.tokenInvalid, err.message, 401);
    }
};
