const express = require('express');
const { body } = require('express-validator');
const { loginAdmin, refreshToken } = require('../controllers/auth.controller');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Xác thực tài khoản
 */

/**
 * @swagger
 * /auth:
 *   post:
 *     summary: Đăng nhập admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: yourpassword
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về accessToken và refreshToken
 *       401:
 *         description: Email hoặc mật khẩu không đúng
 */
router.post(
    '',
    [
        body('email').isEmail().withMessage('Email không hợp lệ'),
        body('password').notEmpty().withMessage('Mật khẩu không được để trống'),
        validateRequest
    ],
    loginAdmin
);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Làm mới accessToken
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: your-refresh-token
 *     responses:
 *       200:
 *         description: Trả về accessToken mới
 *       401:
 *         description: Refresh token không hợp lệ hoặc đã hết hạn
 */
router.post("/refresh-token", refreshToken);

module.exports = router;
