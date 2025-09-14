const moment = require( "moment/moment" );
const Booking = require("../models/Booking");
const User = require( "../models/User" );

// 🟢 Tạo booking mới
exports.createBooking = async (data) => {
    const booking = new Booking(data);
    return await booking.save();
};

// 🟢 Lấy tất cả booking (có phân trang + search + filter)
exports.getBookings = async ({ page = 1, limit = 10, search = "", filters = {} }) => {
    const query = {};

    // ✅ Search theo mã booking, user name hoặc email
    if (search) {
        query.$or = [
            { "paymentInfo.bookingCode": { $regex: search, $options: "i" } },
            // { "userId.name": { $regex: search, $options: "i" } },
            // { "userId.email": { $regex: search, $options: "i" } },
        ];
    }

    // ✅ Filters
    if (filters.status && filters.status !== "") {
        query.status = filters.status;
    }
	if(filters.fromDate && filters.toDate){
		let fromDate = moment(filters.fromDate).startOf('day').format('yyyy-MM-DD HH:mm:ss');
		let toDate = moment(filters.toDate).endOf('day').format('yyyy-MM-DD HH:mm:ss');
		query.createdAt = {
					$gte: fromDate,
					$lte: toDate
		};
	}

    if (filters.customerName && filters.customerName !== "") {
		let userIds = await User.find(
			{ name: { $regex: filters.customerName, $options: "i" } })
			.select("_id");

        query["userId"] = { $in: userIds};
    }

    if (filters.paymentMethod && filters.paymentMethod !== "") {
        query["paymentInfo.paymentMethod"] = filters.paymentMethod;
    }

    // ✅ Đếm tổng số bản ghi
    const total = await Booking.countDocuments(query);

    // ✅ Lấy danh sách phân trang
    const data = await Booking.find(query)
        .populate("userId", "name email")
        .populate("hotelId", "name address")
        .populate("roomId", "name price")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

    return { data, total};
};

// 🟢 Lấy chi tiết 1 booking
exports.getBookingById = async (id) => {
    return await Booking.findById(id)
        .populate("userId", "name email")
        .populate("hotelId", "name address")
        .populate("roomId", "name price");
};

// 🟢 Lấy booking theo khách hàng
exports.getBookingsByUser = async (userId) => {
    return await Booking.find({ userId })
        .populate("hotelId", "name address")
        .populate("roomId", "name price");
};

// 🟢 Lấy booking theo khách sạn (hotel_owner)
exports.getBookingsByHotel = async (hotelId) => {
    return await Booking.find({ hotelId })
        .populate("userId", "name email")
        .populate("roomId", "name price");
};

// 🟢 Cập nhật booking
exports.updateBooking = async (id, data) => {
    return await Booking.findByIdAndUpdate(id, data, { new: true })
        .populate("userId", "name email")
        .populate("hotelId", "name address")
        .populate("roomId", "name price");
};

// 🟢 Xóa booking
exports.deleteBooking = async (id) => {
    return await Booking.findByIdAndDelete(id);
};
