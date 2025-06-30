const { successResponse, errorResponse } = require("../utils/baseResponse");
const partnerService = require("../services/partner.service");
const messages = require("../utils/messages");
const userService = require("../services/user.service");

exports.registerPartner = async (req, res) => {
    try {
        const data = req.body;
        const licenseFile = req.file;

        if (!licenseFile) {
            return errorResponse(res, "Thiếu file giấy phép kinh doanh.", null, 400);
        }
        const result = await partnerService.registerPartner({ ...data, licenseFile });
        return successResponse(res, "Đăng ký thành công!", result);
    } catch (err) {
        return errorResponse(
            res,
            err.message || messages.partner.registerError,
            null,
            err.statusCode || 500
        );
    }
};

exports.getPartners = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "" } = req.query;

        const getFilterArray = (key) => {
            const raw = req.query[key] || req.query[`${key}[]`];
            if (Array.isArray(raw)) return raw;
            if (typeof raw === "string") return [raw];
            return [];
        };

        const filters = {
            status: getFilterArray("status"),
            businessType: getFilterArray("businessType"),
        };

        const result = await partnerService.getPartners(+page, +limit, search, filters);
        return successResponse(res, "Lấy danh sách đối tác thành công!", result);
    } catch (err) {
        return errorResponse(res, err.message || "Lỗi khi lấy danh sách đối tác", null, err.statusCode || 500);
    }
};

exports.getPartnerById = async (req, res) => {
    try {
        const { id } = req.params;
        const partner = await partnerService.getPartnerById(id);
        return successResponse(res, "Lấy thông tin đối tác thành công!", partner);
    } catch (err) {
        return errorResponse(res, err.message || messages.user.getUserError, null, err.statusCode || 500);
    }
};


exports.approvePartner = async (req, res) => {
    try {
        const partnerId = req.params.id;

        const updatedPartner = await partnerService.approvePartner(partnerId);

        return successResponse(
            res,
            `Đối tác ${updatedPartner.companyName} đã được duyệt thành công!`,
            updatedPartner
        );
    } catch (err) {
        return errorResponse(
            res,
            err.message || "Lỗi khi duyệt đối tác.",
            null,
            err.statusCode || 500
        );
    }
};

exports.rejectPartner = async (req, res) => {
    try {
        const partnerId = req.params.id;

        const updatedPartner = await partnerService.rejectPartner(partnerId);

        return successResponse(
            res,
            `Đối tác ${updatedPartner.companyName} đã bị từ chối.`,
            updatedPartner
        );
    } catch (err) {
        return errorResponse(
            res,
            err.message || "Lỗi khi từ chối đối tác.",
            null,
            err.statusCode || 500
        );
    }
};

exports.deactivatePartner = async (req, res) => {
    try {
        const partnerId = req.params.id;

        const updatedPartner = await partnerService.deactivatePartner(partnerId);

        return successResponse(
            res,
            `Đối tác ${updatedPartner.companyName} đã bị tạm khóa.`,
            updatedPartner
        );
    } catch (err) {
        return errorResponse(
            res,
            err.message || "Lỗi khi tạm khóa đối tác.",
            null,
            err.statusCode || 500
        );
    }
};

exports.createPartnerByAdmin = async (req, res) => {
    try {
        const result = await partnerService.createPartnerByAdmin(req.body);
        return successResponse(res, "Tạo đối tác thành công!", result);
    } catch (err) {
        return errorResponse(res, err.message || "Lỗi khi tạo đối tác", null, err.statusCode || 500);
    }
};

exports.deletePartner = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedPartner = await partnerService.deletePartner(id);
        return successResponse(
            res,
            `Đối tác ${deletedPartner.companyName} đã được xóa thành công!`,
            deletedPartner
        );
    } catch (err) {
        return errorResponse(
            res,
            err.message || "Lỗi khi xóa đối tác.",
            null,
            err.statusCode || 500
        );
    }
};
