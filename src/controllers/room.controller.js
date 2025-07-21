const roomService = require("../services/room.service");
const { successResponse, errorResponse } = require("../utils/baseResponse");

exports.getRooms = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "", city = "", hotelName = "" } = req.query;

        const filters = {
            city,
            hotelName,
        };

        const result = await roomService.getRooms(+page, +limit, search, filters);
        return successResponse(res, "Lấy danh sách phòng thành công!", result);
    } catch (err) {
        return errorResponse(res, err.message, null, err.statusCode || 500);
    }
};

exports.getRoomById = async (req, res) => {
    try {
        const result = await roomService.getRoomById(req.params.id);
        return successResponse(res, "Lấy chi tiết phòng thành công!", result);
    } catch (err) {
        return errorResponse(res, err.message, null, err.statusCode || 500);
    }
};

exports.getRoomsByHotel = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "" } = req.query;
        const result = await roomService.getRoomsByHotel(
            req.params.hotelId,
            +page,
            +limit,
            search
        );
        return successResponse(res, "Lấy danh sách phòng theo khách sạn thành công!", result);
    } catch (err) {
        return errorResponse(res, err.message, null, err.statusCode || 500);
    }
};

exports.createRoom = async (req, res) => {
    try {
        const result = await roomService.createRoom(req.body);
        return successResponse(res, "Tạo phòng mới thành công!", result);
    } catch (err) {
        return errorResponse(res, err.message, null, err.statusCode || 500);
    }
};

exports.updateRoom = async (req, res) => {
    try {
        const result = await roomService.updateRoom(req.params.id, req.body);
        return successResponse(res, "Cập nhật phòng thành công!", result);
    } catch (err) {
        return errorResponse(res, err.message, null, err.statusCode || 500);
    }
};

exports.deleteRoom = async (req, res) => {
    try {
        const result = await roomService.deleteRoom(req.params.id);
        return successResponse(res, "Xoá phòng thành công!", result);
    } catch (err) {
        return errorResponse(res, err.message, null, err.statusCode || 500);
    }
};

exports.toggleVisibility = async (req, res) => {
    try {
        const result = await roomService.toggleVisibility(req.params.id);
        return successResponse(res, "Cập nhật trạng thái hiển thị thành công!", result);
    } catch (err) {
        return errorResponse(res, err.message, null, err.statusCode || 500);
    }
};
