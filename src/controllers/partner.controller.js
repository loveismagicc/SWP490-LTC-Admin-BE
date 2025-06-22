const { successResponse, errorResponse } = require("../utils/baseResponse");
const partnerService = require("../services/partner.service");
const messages = require("../utils/messages");

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


exports.confirmPartner = async (req, res) => {
    try {
        const partnerId = req.params.id;

        const partner = await partnerService.confirmPartner(partnerId);

        res.send(`
            <div style="text-align:center; padding:40px; font-family:sans-serif">
                <h2>🎉 Đối tác ${partner.companyName} đã được xác nhận thành công!</h2>
                <a href="${process.env.ADMIN_DASHBOARD_URL}/partners" style="color:#2196F3">Quay về trang quản trị</a>
            </div>
        `);
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).send(error.message);
        }
        res.status(500).send("Lỗi xác nhận đối tác.");
    }
};
