const statisticService = require("../services/statistic.service");
const { successResponse, errorResponse } = require("../utils/baseResponse");

exports.getStatistic = async (req, res) => {
    try {
        const result = await statisticService.getStatisticTotal();
        return successResponse(res, "Successfully!", result);
    } catch (err) {
        return errorResponse(res, err.message, null, err.statusCode || 500);
    }
};

exports.getStatisticGroupTime = async (req, res) => {
    try {
        const result = await statisticService.groupByTime(req.start, req.end);
        return successResponse(res, "Successfully!", result);
    } catch (err) {
        return errorResponse(res, err.message, null, err.statusCode || 500);
    }
};

exports.getStatisticGroupTime = async (req, res) => {
    try {
        const result = await statisticService.groupByTime(req.start, req.end);
        return successResponse(res, "Successfully!", result);
    } catch (err) {
        return errorResponse(res, err.message, null, err.statusCode || 500);
    }
};

exports.getStatisticGroupByMonth = async (req, res) => {
    try {
        const result = await statisticService.groupByMonthNow();
        return successResponse(res, "Successfully!", result);
    } catch (err) {
        return errorResponse(res, err.message, null, err.statusCode || 500);
    }
};

exports.getStatisticQuarter= async (req, res) => {
    try {
        const result = await statisticService.groupByQuarter();
        return successResponse(res, "Successfully!", result);
    } catch (err) {
        return errorResponse(res, err.message, null, err.statusCode || 500);
    }
};

exports.getStatisticYear= async (req, res) => {
    try {
        const result = await statisticService.groupByYear();
        return successResponse(res, "Successfully!", result);
    } catch (err) {
        return errorResponse(res, err.message, null, err.statusCode || 500);
    }
};