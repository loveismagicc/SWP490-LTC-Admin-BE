const express = require('express');
const { protectAdmin } = require('../middlewares/authMiddleware');
const { successResponse } = require('../utils/baseResponse');

const router = express.Router();

router.get('', protectAdmin, (req, res) => {
    return successResponse(res, 'Truy cập thành công dashboard', {
        admin: req.user,
    });
});

module.exports = router;
