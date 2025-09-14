const Hotel = require("../models/Hotel");

exports.getHotels = async (page, limit, search, filters) => {
    const skip = (page - 1) * limit;

    const query = {};

    if (search) {
        query.name = { $regex: search, $options: "i" };
    }

    if (filters.status && filters.status.length > 0) {
        query.status = { $in: filters.status };
    }
    if (filters.ownerId) query.ownerId = filters.ownerId;
    if (filters.address) query.address = { $regex: filters.address, $options: "i" };

    const [total, data] = await Promise.all([
        Hotel.countDocuments(query),
        Hotel.find(query)
            .populate("ownerId", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
    ]);

    return { total, data };
};

exports.updateStatus = async (id, status) => {
    return Hotel.findByIdAndUpdate(id, { status }, { new: true });
};

exports.toggleVisibility = async (id) => {
    const hotel = await Hotel.findById(id);
    if (!hotel) throw new Error("Không tìm thấy khách sạn");

    const newStatus = hotel.status === "active" ? "inactive" : "active";
    hotel.status = newStatus;
    return hotel.save();
};

exports.updateHotel = async (id, data) => {
    return Hotel.findByIdAndUpdate(id, data, { new: true });
};

exports.updateImages = async (id, images) => {
    return Hotel.findByIdAndUpdate(id, { images }, { new: true });
};
exports.createHotel = async (hotelData) => {
    try {
        const newHotel = new Hotel(hotelData);
        return await newHotel.save();
    } catch (err) {
        throw {
            message: "Không thể tạo khách sạn mới",
            statusCode: 400,
            originalError: err,
        };
    }
};
exports.getHotelById = async (id) => {
    const hotel = await Hotel.findById(id);
	console.log("id, hotel", id, hotel);
    if (!hotel) {
        throw {
            message: "Không tìm thấy khách sạn",
            statusCode: 404
        };
    }

    return hotel;
};


