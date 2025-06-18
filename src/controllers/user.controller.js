const User = require('../models/User');
const { successResponse, createdResponse, errorResponse } = require('../utils/baseResponse');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return successResponse(res, 'Lấy danh sách người dùng thành công', users);
  } catch (error) {
    return errorResponse(res, 'Lỗi khi lấy danh sách người dùng', error.message);
  }
};

exports.createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    return createdResponse(res, 'Tạo người dùng thành công', newUser);
  } catch (error) {
    return errorResponse(res, 'Lỗi khi tạo người dùng', error.message);
  }
};
