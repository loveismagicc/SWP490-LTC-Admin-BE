const Booking = require("../models/Booking");
const ExcelJS = require("exceljs");

function buildDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // chuẩn hoá về đầu ngày – cuối ngày (dùng < nextDayStart để an toàn timezone)
    start.setHours(0, 0, 0, 0);
    const nextDayStart = new Date(end);
    nextDayStart.setDate(nextDayStart.getDate() + 1);
    nextDayStart.setHours(0, 0, 0, 0);

    return { start, nextDayStart };
}

exports.getRevenues = async (page = 1, limit = 10, search = "", filters = {}) => {
    const skip = (page - 1) * limit;
    const query = {};

    // Search theo bookingCode
    if (search && String(search).trim()) {
        const s = String(search).trim();
        query["paymentInfo.bookingCode"] = { $regex: s, $options: "i" };
    }

    // Lọc theo ngày tạo booking (tuỳ nhu cầu có thể đổi sang paidAt/checkout)
    if (filters.startDate && filters.endDate) {
        const { start, nextDayStart } = buildDateRange(filters.startDate, filters.endDate);
        query.createdAt = { $gte: start, $lt: nextDayStart };
    }

    // Lọc theo trạng thái payout (ví dụ: ['paid', 'unpaid'])
    if (Array.isArray(filters.status) && filters.status.length) {
        query["paymentInfo.payoutStatus"] = { $in: filters.status };
    }

    const [docs, total, sumAgg] = await Promise.all([
        Booking.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("hotelId", "name")
            .populate("roomId", "roomType")
            .populate("userId", "name email")
            .lean(),
        Booking.countDocuments(query),
        Booking.aggregate([
            { $match: query },
            { $group: { _id: null, sum: { $sum: "$totalPrice" } } },
        ]),
    ]);

    const totalAmount = sumAgg?.[0]?.sum || 0;

    const data = docs.map((b) => ({
        _id: b._id, // để FE dùng nếu cần
        bookingCode: b.paymentInfo?.bookingCode || "",
        partnerName: b.userId?.name || "",     // hoặc partner nếu có
        hotelName: b.hotelId?.name || "",
        roomType: b.roomId?.roomType || "",
        amount: b.totalPrice ?? 0,
        commission: b.commissionAmount ?? 0,
        netAmount: b.netPayoutAmount ?? 0,
        date: b.createdAt,
        status: b.paymentInfo?.payoutStatus || "unpaid",
    }));

    return { data, total, totalAmount };
};

exports.getRevenueById = async (id) => {
    const b = await Booking.findById(id)
        .populate("hotelId", "name")
        .populate("roomId", "roomType")
        .populate("userId", "name email");

    if (!b) throw new Error("Không tìm thấy booking");

    return {
        _id: b._id,
        bookingCode: b.paymentInfo?.bookingCode || "",
        partnerName: b.userId?.name || "",
        hotelName: b.hotelId?.name || "",
        roomType: b.roomId?.roomType || "",
        amount: b.totalPrice ?? 0,
        commission: b.commissionAmount ?? 0,
        netAmount: b.netPayoutAmount ?? 0,
        date: b.createdAt,
        status: b.paymentInfo?.payoutStatus || "unpaid",
    };
};

exports.exportExcel = async ({ startDate, endDate, status = [] } = {}) => {
    const query = {};

    if (startDate && endDate) {
        const { start, nextDayStart } = buildDateRange(startDate, endDate);
        query.createdAt = { $gte: start, $lt: nextDayStart };
    }

    if (Array.isArray(status) && status.length) {
        query["paymentInfo.payoutStatus"] = { $in: status };
    }

    const docs = await Booking.find(query)
        .sort({ createdAt: -1 })
        .populate("hotelId", "name")
        .populate("roomId", "roomType")
        .populate("userId", "name")
        .lean();

    // Tạo workbook và worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Revenue");

    // Thêm header
    worksheet.columns = [
        { header: "Booking Code", key: "bookingCode", width: 20 },
        { header: "Partner", key: "partnerName", width: 20 },
        { header: "Hotel", key: "hotelName", width: 25 },
        { header: "Room Type", key: "roomType", width: 20 },
        { header: "Amount", key: "amount", width: 15 },
        { header: "Commission", key: "commission", width: 15 },
        { header: "Net Amount", key: "netAmount", width: 15 },
        { header: "Date", key: "date", width: 20 },
        { header: "Status", key: "status", width: 15 },
    ];

    // Thêm data
    docs.forEach((b) => {
        worksheet.addRow({
            bookingCode: b.paymentInfo?.bookingCode || "",
            partnerName: b.userId?.name || "",
            hotelName: b.hotelId?.name || "",
            roomType: b.roomId?.roomType || "",
            amount: b.totalPrice ?? 0,
            commission: b.commissionAmount ?? 0,
            netAmount: b.netPayoutAmount ?? 0,
            date: b.createdAt,
            status: b.paymentInfo?.payoutStatus || "unpaid",
        });
    });

    // Trả về buffer
    return await workbook.xlsx.writeBuffer();
};
