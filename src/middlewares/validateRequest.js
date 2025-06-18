const { validationResult } = require('express-validator');
const { validationErrorResponse } = require('../utils/baseResponse');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Map lỗi chi tiết theo field
    const errorList = errors.array().map((err) => ({
      field: err.param,
      message: err.msg,
    }));

    return validationErrorResponse(res, errorList);
  }

  next();
};

module.exports = validateRequest;
