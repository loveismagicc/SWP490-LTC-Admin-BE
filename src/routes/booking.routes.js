const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.controller");
const {protectAdmin} = require("../middlewares/authMiddleware");

// Tạo booking mới
router.post("/", bookingController.createBooking);

// Lấy tất cả booking (admin)
router.get("/", bookingController.getBookings);

// Lấy chi tiết booking theo id
router.get("/:id", bookingController.getBookingById);

// Lấy booking theo userId
router.get("/user/:userId", bookingController.getBookingsByUser);

// Lấy booking theo hotelId
router.get("/hotel/:hotelId", bookingController.getBookingsByHotel);

// Cập nhật booking
router.put("/:id", bookingController.updateBooking);

// Xóa booking
router.delete("/:id", bookingController.deleteBooking);

module.exports = router;
