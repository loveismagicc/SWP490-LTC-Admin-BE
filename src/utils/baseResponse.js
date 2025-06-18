
const messages = require('../utils/messages');
exports.successResponse = (res, message, data = {}) => {
  return res.status(200).json({
    success: true,
    message,
    data,
  });
};

exports.createdResponse = (res, message, data = {}) => {
  return res.status(201).json({
    success: true,
    message,
    data,
  });
};

exports.errorResponse = (res, message = messages.common.serverError, error = null, code = 500) => {
  return res.status(code).json({
    success: false,
    message,
    error,
  });
};

exports.validationErrorResponse = (res, errors = [], message = messages.common.validationError) => {
  return res.status(400).json({
    success: false,
    message,
    errors,
  });
};
