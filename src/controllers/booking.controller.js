const bookingService = require("../services/booking.service");
const { successResponse, errorResponse } = require("../utils/baseResponse");

exports.createBooking = async (req, res) => {
    try {
        const result = await bookingService.createBooking(req.body);
        return successResponse(res, "Tạo booking thành công!", result);
    } catch (err) {
        return errorResponse(res, err.message, null, err.statusCode || 500);
    }
};

exports.getBookings = async (req, res) => {
    try {
        let { page = 1, limit = 10, search = "", filters = "{}" } = req.query;

        page = +page;
        limit = +limit;

        let parsedFilters = {};
        try {
            parsedFilters = JSON.parse(filters);
        } catch {
            parsedFilters = {};
        }

        const result = await bookingService.getBookings({
            page,
            limit,
            search,
            filters: parsedFilters
        });

        return successResponse(res, "Lấy danh sách booking thành công!", result);
    } catch (err) {
        return errorResponse(res, err.message, null, err.statusCode || 500);
    }
};

exports.getBookingById = async (req, res) => {
    try {
        const result = await bookingService.getBookingById(req.params.id);
        return successResponse(res, "Lấy chi tiết booking thành công!", result);
    } catch (err) {
        return errorResponse(res, err.message, null, err.statusCode || 500);
    }
};

exports.getBookingsByUser = async (req, res) => {
    try {
        const result = await bookingService.getBookingsByUser(req.params.userId);
        return successResponse(res, "Lấy danh sách booking theo user thành công!", result);
    } catch (err) {
        return errorResponse(res, err.message, null, err.statusCode || 500);
    }
};

exports.getBookingsByHotel = async (req, res) => {
    try {
        const result = await bookingService.getBookingsByHotel(req.params.hotelId);
        return successResponse(res, "Lấy danh sách booking theo khách sạn thành công!", result);
    } catch (err) {
        return errorResponse(res, err.message, null, err.statusCode || 500);
    }
};

exports.updateBooking = async (req, res) => {
    try {
        const result = await bookingService.updateBooking(req.params.id, req.body);
        return successResponse(res, "Cập nhật booking thành công!", result);
    } catch (err) {
        return errorResponse(res, err.message, null, err.statusCode || 500);
    }
};

exports.deleteBooking = async (req, res) => {
    try {
        const result = await bookingService.deleteBooking(req.params.id);
        return successResponse(res, "Xoá booking thành công!", result);
    } catch (err) {
        return errorResponse(res, err.message, null, err.statusCode || 500);
    }
};
