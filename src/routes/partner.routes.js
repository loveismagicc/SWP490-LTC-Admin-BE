const express = require("express");
const router = express.Router();
const partnerController = require("../controllers/partner.controller");
const upload = require("../middlewares/upload");
const { protectAdmin } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Partner
 *   description: API quản lý đối tác
 */

/**
 * @swagger
 * /partner/register:
 *   post:
 *     summary: Đăng ký đối tác (từ ngoài hệ thống)
 *     tags: [Partner]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *               taxId:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               website:
 *                 type: string
 *               contactName:
 *                 type: string
 *               licenseFile:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 */
router.post("/register", upload.single("licenseFile"), partnerController.registerPartner);

/**
 * @swagger
 * /partner:
 *   get:
 *     summary: Lấy danh sách đối tác
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về danh sách đối tác
 */
router.get("/", protectAdmin, partnerController.getPartners);

/**
 * @swagger
 * /partner/approve/{id}:
 *   patch:
 *     summary: Duyệt đối tác
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID của đối tác
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Duyệt thành công
 */
router.patch("/approve/:id", protectAdmin, partnerController.approvePartner);

/**
 * @swagger
 * /partner/reject/{id}:
 *   patch:
 *     summary: Từ chối đối tác
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID đối tác
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Từ chối thành công
 */
router.patch("/reject/:id", protectAdmin, partnerController.rejectPartner);

/**
 * @swagger
 * /partner/de-activate/{id}:
 *   patch:
 *     summary: Khóa đối tác
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID đối tác
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Khóa thành công
 */
router.patch("/de-activate/:id", protectAdmin, partnerController.deactivatePartner);

/**
 * @swagger
 * /partner/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết đối tác
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID đối tác
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get("/:id", protectAdmin, partnerController.getPartnerById);

/**
 * @swagger
 * /partner:
 *   post:
 *     summary: Admin tạo đối tác
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *               taxId:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               website:
 *                 type: string
 *               contactName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post("/", protectAdmin, partnerController.createPartnerByAdmin);

/**
 * @swagger
 * /partner/{id}:
 *   delete:
 *     summary: Xóa đối tác
 *     tags: [Partner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID đối tác
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete("/:id", protectAdmin, partnerController.deletePartner);

module.exports = router;
