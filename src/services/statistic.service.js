const moment = require("moment/moment");
const User = require("../models/User");
const Hotel = require("../models/Hotel");
const Room = require("../models/Room");
const Booking = require("../models/Booking");

const daysInMonth = (year, month) => new Date(year, month, 0).getDate();
exports.groupByTime = async (start, end) => {
	try {
		const result = await Booking.aggregate([
			{
				$match: {
					createdAt: { $gte: new Date(start), $lte: new Date(end) },
				},
			},
			{
				$group: {
					_id: {
						$dateToString: {
							format: "%Y-%m-%d",
							date: "$createdAt",
						},
					},
					totalRevenue: { $sum: "$totalPrice" },
					count: { $sum: 1 },
				},
			},
			{ $sort: { _id: 1 } },
		]);
		return result;
	} catch (err) {
		console.error(err.message);
		throw err;
	}
};

exports.groupByMonthNow = async () => {
	// Group by từng ngày trong tháng hiện tại
	const start = moment().startOf("month").toDate();
	const end = moment().endOf("month").toDate();
	let data = [];
	for (let month = 0; month < 12; month++) {
		// tháng trong moment bắt đầu từ 0
		const start = moment().month(month).startOf("month");
		const end = moment().month(month).endOf("month");
		const result = await this.groupByTime(start, end);
		let totalRevenue = result.reduce((sum, item) => sum + (item?.totalRevenue || 0), 0);
		let totalCount = result.reduce((sum, item) => sum + (item?.count || 0), 0);
		data.push({
			_id: `T${month + 1}`,
			totalRevenue: totalRevenue || 0,
			count: totalCount || 0,
		});
	}
	return data;
};
exports.groupByQuarter = async () => {
	// Group by quý trong năm hiện tại
	let data = [];
	for (let quarter = 1; quarter <= 4; quarter++) {
		const start = moment().quarter(quarter).startOf("quarter").toDate();
		const end = moment().quarter(quarter).endOf("quarter").toDate();
		console.log("start", start);
		console.log("end", end);
		const result = await Booking.aggregate([
			{
				$match: {
					createdAt: { $gte: start, $lte: end },
				},
			},
			{
				$group: {
					_id: {
						$concat: [
							{ $toString: { $year: "$createdAt" } },
							"-Q",
							{
								$toString: {
									$ceil: {
										$divide: [{ $month: "$createdAt" }, 3],
									},
								},
							},
						],
					},
					totalRevenue: { $sum: "$totalPrice" },
					count: { $sum: 1 },
				},
			},
			{ $sort: { _id: 1 } },
		]);
		let totalRevenue = result.reduce((sum, item) => sum + (item?.totalRevenue || 0), 0);
		let totalCount = result.reduce((sum, item) => sum + (item?.count || 0), 0);
		data.push({
			_id: `Q${quarter}`,
			totalRevenue: totalRevenue || 0,
			count: totalCount || 0,
		});
	}

	return data;
};

exports.groupByYear = async () => {
	// Group by từng tháng trong năm hiện tại
	const start = moment().startOf("year").toDate();
	const end = moment().endOf("year").toDate();
	return await Booking.aggregate([
		{
			$match: {
				createdAt: { $gte: start, $lte: end },
			},
		},
		{
			$group: {
				_id: {
					$dateToString: { format: "%Y-%m", date: "$createdAt" },
				},
				totalRevenue: { $sum: "$totalPrice" },
				count: { $sum: 1 },
			},
		},
		{ $sort: { _id: 1 } },
	]);
};
exports.getStatisticTotal = async () => {
	// destructure page and limit and set default values
	try {
		let totalCustomers = await User.countDocuments({ role: "customer" });
		let totalPartners = await User.countDocuments({ role: "hotel_owner" });
		// Đếm số lượng khách sạn group by status
		let hotelStatusCount = await Hotel.aggregate([
			{
				$group: {
					_id: "$status",
					count: { $sum: 1 },
				},
			},
		]);

		// Count room
		const totalRooms = await Room.countDocuments();

		// Count totalPrice
		const revenueStatusMap = await Booking.aggregate([
			{
				$group: {
					_id: "$status",
					totalRevenue: { $sum: "$totalPrice" },
					count: { $sum: 1 },
				},
			},
		]);

		// Count netRevenue
		const netRevenueByStatusMap = await Booking.aggregate([
			{
				$group: {
					_id: "$status",
					totalRevenue: { $sum: "$netPayoutAmount" },
					count: { $sum: 1 },
				},
			},
		]);

		const totalBookings = await Booking.countDocuments();

		// Lấy thời gian bắt đầu và kết thúc của ngày hôm nay
		const startOfDay = moment().startOf("day").toDate();
		const endOfDay = moment().endOf("day").toDate();

		// Tính tổng revenue của ngày hôm nay
		const result = await Booking.aggregate([
			{
				$match: {
					createdAt: { $gte: startOfDay, $lte: endOfDay },
				},
			},
			{
				$group: {
					_id: null,
					totalRevenue: { $sum: "$totalPrice" },
					count: { $sum: 1 },
				},
			},
		]);

		return {
			totalCustomers,
			totalPartners,
			hotelStatusCount,
			totalRooms,
			totalBookings,
			revenueStatusMap,
			netRevenueByStatusMap,
			todayRevenue: result[0]?.totalRevenue || 0,
		};
	} catch (err) {
		console.error(err.message);
		throw new Error(err.message);
	}
};
