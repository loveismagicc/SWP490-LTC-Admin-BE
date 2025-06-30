const hotelService = require("../services/hotel.service");
const { successResponse, errorResponse } = require("../utils/baseResponse");

exports.getHotels = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "", status, ownerId, address } = req.query;

        const filters = {
            status,
            ownerId,
            address,
        };

        const result = await hotelService.getHotels(+page, +limit, search, filters);
        return successResponse(res, "Lấy danh sách khách sạn thành công!", result);
    } catch (err) {
        return errorResponse(res, err.message, null, err.statusCode || 500);
    }
};

exports.approveHotel = async (req, res) => {
    try {
        const result = await hotelService.updateStatus(req.params.id, "active");
        return successResponse(res, "Duyệt khách sạn thành công!", result);
    } catch (err) {
        return errorResponse(res, err.message, null, err.statusCode || 500);
    }
};

exports.rejectHotel = async (req, res) => {
    try {
        const result = await hotelService.updateStatus(req.params.id, "inactive");
        return successResponse(res, "Từ chối khách sạn thành công!", result);
    } catch (err) {
        return errorResponse(res, err.message, null, err.statusCode || 500);
    }
};

exports.toggleVisibility = async (req, res) => {
    try {
        const result = await hotelService.toggleVisibility(req.params.id);
        return successResponse(res, "Cập nhật trạng thái hiển thị thành công!", result);
    } catch (err) {
        return errorResponse(res, err.message, null, err.statusCode || 500);
    }
};

exports.updateHotel = async (req, res) => {
    try {
        const result = await hotelService.updateHotel(req.params.id, req.body);
        return successResponse(res, "Cập nhật thông tin khách sạn thành công!", result);
    } catch (err) {
        return errorResponse(res, err.message, null, err.statusCode || 500);
    }
};

exports.updateHotelImages = async (req, res) => {
    try {
        const { images } = req.body; // expect array of image URLs
        const result = await hotelService.updateImages(req.params.id, images);
        return successResponse(res, "Cập nhật ảnh khách sạn thành công!", result);
    } catch (err) {
        return errorResponse(res, err.message, null, err.statusCode || 500);
    }
};
exports.createHotel = async (req, res) => {
    try {
        const {
            name,
            address,
            city,
            rating,
            description,
            status = "pending",
            images = []
        } = req.body;

        if (!name || !address || !city || !ownerId) {
            return errorResponse(res, "Thiếu thông tin bắt buộc!", null, 400);
        }

        const result = await hotelService.createHotel({
            name,
            address,
            city,
            rating: rating || 3,
            description: description || "",
            status,
            images
        });

        return successResponse(res, "Thêm khách sạn thành công!", result);
    } catch (err) {
        return errorResponse(res, err.message, null, err.statusCode || 500);
    }
};

