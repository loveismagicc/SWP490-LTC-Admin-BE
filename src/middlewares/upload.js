const multer = require("multer");

const storage = multer.memoryStorage(); // Lưu vào bộ nhớ (hoặc dùng diskStorage nếu muốn lưu file)

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // Giới hạn 10MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("File không hợp lệ. Chỉ chấp nhận PDF, JPG, PNG."), false);
        }
        cb(null, true);
    }
});

module.exports = upload;
