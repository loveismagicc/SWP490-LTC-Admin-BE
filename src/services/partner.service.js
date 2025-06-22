const Partner = require("../models/Partner");
const {sendMail} = require("../utils/mailer");

exports.registerPartner = async (data) => {
    const {
        companyName,
        taxId,
        email,
        phone,
        address,
        website,
        contactName,
        contactPosition,
        description,
        licenseFile,
        businessType
    } = data;

    const existing = await Partner.findOne({
        $or: [{email: data.email}, {taxId: data.taxId}],
    });

    if (existing) {
        const error = new Error("Email hoặc mã số thuế đã được sử dụng");
        error.statusCode = 400;
        throw error;
    }

    // Nếu licenseFile được truyền (từ multer)
    const fileData = licenseFile ? {
        originalName: licenseFile.originalname,
        mimeType: licenseFile.mimetype,
        size: licenseFile.size,
        buffer: licenseFile.buffer, // bạn có thể bỏ đi nếu không muốn lưu buffer
    } : null;

    const newPartner = new Partner({
        companyName,
        taxId,
        email,
        phone,
        address,
        website,
        contactName,
        contactPosition,
        description,
        licenseFile: fileData,
        businessType,
        status: "pending",
    });

    await newPartner.save();

    try {
        await sendMail({
            to: process.env.ADMIN_EMAIL, subject: "📝 Đăng ký Đối tác Kinh doanh Mới", html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
    <h2 style="color: #2c3e50;">📬 Yêu cầu Đăng ký Đối tác Mới</h2>
    <table style="border-collapse: collapse; width: 100%; max-width: 600px; margin-top: 15px;">
        <tr style="background-color: #f2f2f2;">
            <td style="padding: 8px; font-weight: bold;">Tên công ty</td>
            <td style="padding: 8px;">${data.companyName}</td>
        </tr>
        <tr>
            <td style="padding: 8px; font-weight: bold;">Mã số thuế</td>
            <td style="padding: 8px;">${data.taxId}</td>
        </tr>
        <tr style="background-color: #f2f2f2;">
            <td style="padding: 8px; font-weight: bold;">Email</td>
            <td style="padding: 8px;">${data.email}</td>
        </tr>
        <tr>
            <td style="padding: 8px; font-weight: bold;">Số điện thoại</td>
            <td style="padding: 8px;">${data.phone}</td>
        </tr>
        <tr style="background-color: #f2f2f2;">
            <td style="padding: 8px; font-weight: bold;">Người liên hệ</td>
            <td style="padding: 8px;">${data.contactName}</td>
        </tr>
        <tr>
            <td style="padding: 8px; font-weight: bold;">Chức vụ</td>
            <td style="padding: 8px;">${data.contactPosition || "Không có"}</td>
        </tr>
        <tr style="background-color: #f2f2f2;">
            <td style="padding: 8px; font-weight: bold;">Địa chỉ</td>
            <td style="padding: 8px;">${data.address}</td>
        </tr>
        <tr>
            <td style="padding: 8px; font-weight: bold;">Website</td>
            <td style="padding: 8px;">${data.website || "Không có"}</td>
        </tr>
        <tr>
            <td style="padding: 8px; font-weight: bold;">Loại hình kinh doanh</td>
            <td style="padding: 8px;">${data.businessType}</td>
        </tr>
        <tr style="background-color: #f2f2f2;">
            <td style="padding: 8px; font-weight: bold;">Mô tả</td>
            <td style="padding: 8px;">${data.description || "Không có"}</td>
        </tr>
    </table>

    <p style="margin-top: 20px;">📎 Đã gửi kèm giấy phép kinh doanh trong hệ thống.</p>
</div>
            `,
        });
    } catch (mailErr) {
        console.error("Gửi email thất bại:", mailErr);
    }

    return {
        message: "Đăng ký thành công. Đang chờ xét duyệt.", partner: {
            id: newPartner._id, companyName: newPartner.companyName, email: newPartner.email, status: newPartner.status,
        },
    };
};

exports.confirmPartner = async (partnerId) => {
    const partner = await Partner.findById(partnerId);
    if (!partner) {
        const error = new Error("Không tìm thấy đối tác.");
        error.statusCode = 404;
        throw error;
    }

    if (partner.status === 'approved') {
        return partner; // đã xác nhận rồi, không cần save lại
    }

    partner.status = "approved";
    await partner.save();

    return partner;
};
