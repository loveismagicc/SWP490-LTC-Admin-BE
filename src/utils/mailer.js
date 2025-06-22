const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail", // Hoặc dùng SMTP riêng
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

exports.sendMail = async ({ to, subject, html }) => {
    return transporter.sendMail({
        from: `"Hệ thống Du lịch" <${process.env.MAIL_USER}>`,
        to,
        subject,
        html,
    });
};
