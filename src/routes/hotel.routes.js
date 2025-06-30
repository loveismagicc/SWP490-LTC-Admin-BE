const express = require("express");
const router = express.Router();
const hotelController = require("../controllers/hotel.controller");

/**
 * @swagger
 * tags:
 *   name: Hotel
 *   description: Quản lý khách sạn
 */

/**
 * @swagger
 * /hotel:
 *   get:
 *     tags:
 *       - Hotel
 *     summary: Lấy danh sách khách sạn (tìm kiếm, lọc, phân trang)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, active, inactive]
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *       - in: query
 *         name: ownerId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get("/", hotelController.getHotels);

/**
 * @swagger
 * /hotel/{id}/approve:
 *   patch:
 *     tags:
 *       - Hotel
 *     summary: Duyệt khách sạn (pending → active)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Khách sạn đã được duyệt
 */
router.patch("/:id/approve", hotelController.approveHotel);

/**
 * @swagger
 * /hotel/{id}/reject:
 *   patch:
 *     tags:
 *       - Hotel
 *     summary: Từ chối khách sạn (→ inactive)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Khách sạn đã bị từ chối
 */
router.patch("/:id/reject", hotelController.rejectHotel);

/**
 * @swagger
 * /hotel/{id}/toggle-visibility:
 *   patch:
 *     tags:
 *       - Hotel
 *     summary: Ẩn hoặc hiện khách sạn
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Đã cập nhật trạng thái hiển thị
 */
router.patch("/:id/toggle-visibility", hotelController.toggleVisibility);

/**
 * @swagger
 * /hotel/{id}:
 *   put:
 *     tags:
 *       - Hotel
 *     summary: Cập nhật thông tin khách sạn
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put("/:id", hotelController.updateHotel);

router.post("/", hotelController.createHotel);

/**
 * @swagger
 * /hotel/{id}/images:
 *   patch:
 *     tags:
 *       - Hotel
 *     summary: Cập nhật danh sách ảnh khách sạn
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Cập nhật ảnh thành công
 */
router.patch("/:id/images", hotelController.updateHotelImages);




module.exports = router;
