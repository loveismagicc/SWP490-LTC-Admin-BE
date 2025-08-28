const revenueService = require("../services/revenue.service");
const { successResponse, errorResponse } = require("../utils/baseResponse");

exports.getRevenues = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "", startDate = "", endDate = "", status = "" } = req.query;

        const filters = {
            startDate,
            endDate,
            status,
        };

        const result = await revenueService.getRevenues(+page, +limit, search, filters);
        return successResponse(res, "Lấy danh sách doanh thu thành công!", result);
    } catch (err) {
        return errorResponse(res, err.message, null, err.statusCode || 500);
    }
};

exports.getRevenueById = async (req, res) => {
    try {
        const result = await revenueService.getRevenueById(req.params.id);
        return successResponse(res, "Lấy chi tiết doanh thu thành công!", result);
    } catch (err) {
        return errorResponse(res, err.message, null, err.statusCode || 500);
    }
};


exports.exportExcel = async (req, res) => {
    try {
        const { startDate = "", endDate = "", status = [] } = req.body;
        const fileBuffer = await revenueService.exportExcel({ startDate, endDate, status });

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=revenue.xlsx"
        );
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.send(fileBuffer);
    } catch (err) {
        return errorResponse(res, err.message, null, err.statusCode || 500);
    }
};

