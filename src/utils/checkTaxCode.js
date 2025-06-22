const axios = require("axios");

/**
 * Kiểm tra mã số thuế doanh nghiệp từ API công khai.
 * @param {string} taxCode - Mã số thuế cần kiểm tra.
 * @returns {Promise<Object>} - Thông tin doanh nghiệp nếu hợp lệ.
 * @throws {Error} - Nếu không tìm thấy hoặc API lỗi.
 */
const checkTaxCode = async (taxCode) => {
    try {
        const response = await axios.get(`https://mst-thue.vercel.app/api/mst/${taxCode}`);
        if (response.status === 200 && response.data.success) {
            return { success: true, data: response.data.data };
        } else {
            return { success: false, message: 'Mã số thuế không hợp lệ hoặc không tìm thấy' };
        }
    } catch (err) {
        const error = new Error("Lỗi khi kiểm tra mã số thuế hoặc API không phản hồi");
        error.statusCode = 500;
        throw error;
    }
};

module.exports = checkTaxCode;
