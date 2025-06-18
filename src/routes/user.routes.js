const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

router.get('/', userController.getAllUsers);

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Tên không được để trống'),
    body('email').isEmail().withMessage('Email không hợp lệ'),
    validateRequest,
  ],
  userController.createUser
);

module.exports = router;
