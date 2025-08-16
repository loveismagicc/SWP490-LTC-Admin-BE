const express = require("express");
const router = express.Router();
const roomController = require("../controllers/room.controller");

// Lấy danh sách phòng
router.get("/", roomController.getRooms);

// Lấy chi tiết 1 phòng
router.get("/:id", roomController.getRoomById);

// Tạo mới phòng
router.post("/", roomController.createRoom);

// Cập nhật phòng
router.put("/:id", roomController.updateRoom);

// Xoá phòng
router.delete("/:id", roomController.deleteRoom);

// Ẩn/Hiện phòng
router.post("/:id/toggle-visibility", roomController.toggleVisibility);

module.exports = router;
