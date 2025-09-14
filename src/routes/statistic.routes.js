const express = require('express');
const { protectAdmin } = require('../middlewares/authMiddleware');
const statisticController = require('../controllers/statistic.controller');

const router = express.Router();

router.get('/overview', protectAdmin, statisticController.getStatistic);
router.get('/revenue-by-date', protectAdmin, statisticController.getStatisticGroupTime);
router.get('/revenue-by-month', protectAdmin, statisticController.getStatisticGroupByMonth);
router.get('/revenue-by-quarter', protectAdmin, statisticController.getStatisticQuarter);
router.get('/revenue-by-year', protectAdmin, statisticController.getStatisticYear);

module.exports = router;
