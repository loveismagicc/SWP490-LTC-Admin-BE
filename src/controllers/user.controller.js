const { successResponse, errorResponse } = require("../utils/baseResponse");
const userService = require("../services/user.service");
const messages = require("../utils/messages");

exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const result = await userService.getUsers(+page, +limit, search);
    return successResponse(res, "Lấy danh sách người dùng thành công!", result);
  } catch (err) {
    return errorResponse(res, err.message || messages.user.getUsersError, null, err.statusCode || 500);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    return successResponse(res, "Lấy thông tin người dùng thành công!", user);
  } catch (err) {
    return errorResponse(res, err.message || messages.user.getUserError, null, err.statusCode || 500);
  }
};

exports.createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    return successResponse(res, "Tạo người dùng thành công!", user);
  } catch (err) {
    return errorResponse(res, err.message || messages.user.createUserError, null, err.statusCode || 500);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await userService.updateUser(id, req.body);
    return successResponse(res, "Cập nhật người dùng thành công!", updatedUser);
  } catch (err) {
    return errorResponse(res, err.message || messages.user.updateUserError, null, err.statusCode || 500);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await userService.deleteUser(id);
    return successResponse(res, "Xoá người dùng thành công!");
  } catch (err) {
    return errorResponse(res, err.message || messages.user.deleteUserError, null, err.statusCode || 500);
  }
};