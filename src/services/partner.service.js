const Partner = require("../models/Partner");
const User = require("../models/User");
const {sendMail} = require("../utils/mailer");
const checkTaxCode = require("../utils/checkTaxCode");

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

    // const tax = await checkTaxCode(data.taxId);
    // if(!tax.success) {
    //     const error = new Error("Mã số thuế không tồn tại");
    //     error.statusCode = 400;
    //     throw error;
    // }

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

    try {
        await sendMail({
            to: data.email,
            subject: "🎉 Đăng ký đối tác thành công - Đang chờ xét duyệt",
            html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #2c3e50;">🤝 Cảm ơn bạn đã đăng ký trở thành đối tác của chúng tôi!</h2>

      <p>Xin chào <strong>${data.contactName}</strong>,</p>

      <p>Chúng tôi đã nhận được thông tin đăng ký đối tác từ công ty <strong>${data.companyName}</strong>.</p>

      <p>Đội ngũ quản trị viên sẽ xem xét hồ sơ và phản hồi trong thời gian sớm nhất.</p>

      <hr style="margin: 20px 0;" />

      <h3>📄 Thông tin đã đăng ký:</h3>
      <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
        <tr><td style="padding: 8px; font-weight: bold;">Tên công ty:</td><td>${data.companyName}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Mã số thuế:</td><td>${data.taxId}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Người liên hệ:</td><td>${data.contactName}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td>${data.email}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Số điện thoại:</td><td>${data.phone}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Loại hình kinh doanh:</td><td>${data.businessType}</td></tr>
      </table>

      <p style="margin-top: 20px;">
        📬 Mọi thắc mắc, vui lòng phản hồi email này hoặc liên hệ trực tiếp với đội ngũ hỗ trợ.
      </p>

      <p style="margin-top: 30px;">Trân trọng,<br/><strong>Đội ngũ quản trị hệ thống</strong></p>
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


exports.getPartners = async (page, limit, search, filters = {}) => {
    const skip = (page - 1) * limit;
    const query = {};

    // Tìm kiếm chung
    if (search) {
        query.$or = [
            { email: { $regex: search, $options: "i" } },
            { companyName: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
        ];
    }

    // Lọc theo filters từ FE (VD: filters.status = ['pending'], filters.businessType = ['hotel_owner'])
    if (filters.status && filters.status.length > 0) {
        query.status = { $in: filters.status };
    }

    if (filters.businessType && filters.businessType.length > 0) {
        query.businessType = { $in: filters.businessType };
    }

    const [total, rawData] = await Promise.all([
        Partner.countDocuments(query),
        Partner.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
    ]);

    const data = rawData.map(partner => {
        if (partner.licenseFile) {
            delete partner.licenseFile;
        }
        return partner;
    });

    return { total, data };
};


exports.getPartnerById = async (id) => {
    const partner = await Partner.findById(id);
    if (!partner) {
        const error = new Error("Không tìm thấy người dùng.");
        error.statusCode = 404;
        throw error;
    }
    return partner;
};

exports.approvePartner = async (id) => {
    const partner = await Partner.findById(id);
    if (!partner) {
        const error = new Error("Đối tác không tồn tại");
        error.statusCode = 404;
        throw error;
    }

    const allowedTypes = ['hotel_owner', 'tour_provider'];
    if (!allowedTypes.includes(partner.businessType)) {
        const error = new Error("Loại hình kinh doanh không hợp lệ để tạo tài khoản");
        error.statusCode = 400;
        throw error;
    }

    partner.status = "active";
    await partner.save();

    const existingUser = await User.findOne({ email: partner.email });
    if (!existingUser) {
        const randomPassword = Math.random().toString(36).slice(-8);
        const newUser = new User({
            email: partner.email,
            password: randomPassword,
            name: partner.contactName,
            role: partner.businessType,
            businessType: partner.businessType,
            status: 'active',
        });
        await newUser.save();

        // Gửi mail thông tin đăng nhập
        try {
            await sendMail({
                to: partner.email,
                subject: "✅ Tài khoản Đối tác đã được phê duyệt",
                html: `
<div style="font-family: Arial, sans-serif; padding: 20px;">
  <h2>🎉 Xin chúc mừng!</h2>
  <p>Bạn đã trở thành đối tác chính thức với chúng tôi.</p>
  <p>Dưới đây là thông tin tài khoản đăng nhập:</p>
  <ul>
    <li><strong>Email:</strong> ${partner.email}</li>
    <li><strong>Mật khẩu:</strong> ${randomPassword}</li>
  </ul>
  <p>👉 Hãy đổi mật khẩu ngay sau khi đăng nhập để bảo mật.</p>
  <p>🔗 Truy cập hệ thống tại: <a href="${process.env.PARTNER_PORTAL_URL || '#'}">${process.env.PARTNER_PORTAL_URL || 'Link hệ thống'}</a></p>
</div>
                `,
            });
        } catch (mailErr) {
            console.error("Gửi mail tài khoản thất bại:", mailErr);
        }
    }

    return partner;
};


exports.rejectPartner = async (id) => {
    const partner = await Partner.findById(id);
    if (!partner || !["hotel_owner", "tour_provider"].includes(partner.businessType)) {
        const error = new Error("Đối tác không hợp lệ hoặc không tồn tại");
        error.statusCode = 404;
        throw error;
    }

    partner.status = "banned";
    await partner.save();

    try {
        await sendMail({
            to: partner.email,
            subject: "❌ Yêu cầu đăng ký đối tác bị từ chối",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #c0392b;">📛 Rất tiếc! Hồ sơ đăng ký đối tác của bạn đã bị từ chối.</h2>
                    
                    <p>Xin chào <strong>${partner.contactName}</strong>,</p>

                    <p>Sau khi xem xét hồ sơ đăng ký của công ty <strong>${partner.companyName}</strong>, chúng tôi rất tiếc phải thông báo rằng yêu cầu đã không được chấp thuận.</p>

                    <p>❗️ Bạn có thể kiểm tra lại thông tin đã cung cấp hoặc liên hệ với chúng tôi để biết thêm chi tiết.</p>

                    <hr style="margin: 20px 0;" />

                    <h3>📄 Thông tin đăng ký:</h3>
                    <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
                        <tr><td style="padding: 8px; font-weight: bold;">Tên công ty:</td><td>${partner.companyName}</td></tr>
                        <tr><td style="padding: 8px; font-weight: bold;">Mã số thuế:</td><td>${partner.taxId}</td></tr>
                        <tr><td style="padding: 8px; font-weight: bold;">Người liên hệ:</td><td>${partner.contactName}</td></tr>
                        <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td>${partner.email}</td></tr>
                        <tr><td style="padding: 8px; font-weight: bold;">Loại hình:</td><td>${partner.businessType}</td></tr>
                    </table>

                    <p style="margin-top: 30px;">Trân trọng,<br/><strong>Đội ngũ quản trị hệ thống</strong></p>
                </div>
            `
        });
    } catch (err) {
        console.error("Gửi email từ chối thất bại:", err);
    }

    return partner;
};


exports.deactivatePartner = async (id) => {
    const partner = await Partner.findById(id);
    if (!partner || !["hotel_owner", "tour_provider"].includes(partner.businessType)) {
        const error = new Error("Đối tác không hợp lệ hoặc không tồn tại");
        error.statusCode = 404;
        throw error;
    }

    // Cập nhật trạng thái đối tác
    partner.status = "deactivate";
    await partner.save();

    // Xóa User tương ứng nếu tồn tại
    const deletedUser = await User.findOneAndDelete({ email: partner.email });
    if (deletedUser) {
        console.log(`🔒 User ${deletedUser.email} đã bị xóa do đối tác bị deactivate.`);
    }

    return partner;
};

exports.createPartnerByAdmin = async (data) => {
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
        businessType,
        status = "active",
    } = data;

    const existing = await Partner.findOne({ $or: [{ email }, { taxId }] });
    if (existing) {
        const error = new Error("Email hoặc mã số thuế đã tồn tại");
        error.statusCode = 400;
        throw error;
    }

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
        businessType,
        status,
    });

    await newPartner.save();

    let userInfo = null;
    if (status === "active") {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            const randomPassword = Math.random().toString(36).slice(-8);
            const newUser = new User({
                email,
                password: randomPassword,
                name: contactName,
                role: businessType,
                businessType,
            });
            await newUser.save();

            userInfo = { email, password: randomPassword };

            await sendMail({
                to: email,
                subject: "✅ Tài khoản Đối tác đã được tạo",
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h2>🎉 Chào mừng bạn đến với hệ thống!</h2>
                        <p>Thông tin đăng nhập của bạn:</p>
                        <ul>
                            <li><strong>Email:</strong> ${email}</li>
                            <li><strong>Mật khẩu:</strong> ${randomPassword}</li>
                        </ul>
                        <p>🔐 Hãy đổi mật khẩu ngay sau khi đăng nhập.</p>
                        <p>🔗 Truy cập hệ thống tại: <a href="${process.env.PARTNER_PORTAL_URL || '#'}">${process.env.PARTNER_PORTAL_URL || 'Link hệ thống'}</a></p>
                    </div>
                `,
            });
        }
    }

    return { partner: newPartner, userInfo };
};
exports.deletePartner = async (id) => {
    const partner = await Partner.findByIdAndDelete(id);
    if (!partner) {
        const error = new Error("Không tìm thấy đối tác để xóa.");
        error.statusCode = 404;
        throw error;
    }
    await User.findOneAndDelete({ email: partner.email });
    return partner;
};

