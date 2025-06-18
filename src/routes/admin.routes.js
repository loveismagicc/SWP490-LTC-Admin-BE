const express = require('express');
const { body } = require('express-validator');
const { loginAdmin } = require('../controllers/auth.controller');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Email không hợp lệ'),
        body('password').notEmpty().withMessage('Mật khẩu không được để trống'),
        validateRequest
    ],
    loginAdmin
);

module.exports = router;
