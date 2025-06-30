const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { protectAdmin } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Quản lý người dùng
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Lấy danh sách người dùng
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Trang hiện tại
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng mỗi trang
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get("/", protectAdmin, userController.getUsers);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Lấy chi tiết người dùng theo ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID người dùng
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get("/:id", protectAdmin, userController.getUserById);

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Tạo người dùng mới
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post("/", protectAdmin, userController.createUser);

/**
 * @swagger
 * /user/{id}:
 *   post:
 *     summary: Cập nhật người dùng
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID người dùng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               name: Tên mới
 *               email: newemail@example.com
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.post("/:id", protectAdmin, userController.updateUser);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Xoá người dùng
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID người dùng
 *     responses:
 *       200:
 *         description: Xoá thành công
 */
router.delete("/:id", protectAdmin, userController.deleteUser);

/**
 * @swagger
 * /user/de-activate/{id}:
 *   post:
 *     summary: Khoá người dùng
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID người dùng
 *     responses:
 *       200:
 *         description: Khoá thành công
 */
router.post("/de-activate/:id", protectAdmin, userController.deactivateUser);

/**
 * @swagger
 * /user/re-activate/{id}:
 *   post:
 *     summary: Mở khoá người dùng
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID người dùng
 *     responses:
 *       200:
 *         description: Mở khoá thành công
 */
router.post("/re-activate/:id", protectAdmin, userController.reactivateUser);

module.exports = router;
