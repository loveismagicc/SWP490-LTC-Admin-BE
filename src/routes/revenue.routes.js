const express = require("express");
const router = express.Router();
const revenueController = require("../controllers/revenue.controller");

// Lấy danh sách doanh thu (có phân trang, lọc theo status, ngày)
router.get("/", revenueController.getRevenues);

// Lấy chi tiết 1 bản ghi doanh thu (nếu cần)
router.get("/:id", revenueController.getRevenueById);

// Xuất Excel doanh thu
router.post("/export-excel", revenueController.exportExcel);

module.exports = router;
