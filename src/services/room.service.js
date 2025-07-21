const Room = require("../models/Room");
const Hotel = require("../models/Hotel");

exports.getRooms = async (page, limit, search, filters) => {
    const skip = (page - 1) * limit;

    const query = {};

    if (search) {
        query.roomType = { $regex: search, $options: "i" }; // Giả định bạn muốn search theo loại phòng
    }

    // Lọc theo tên khách sạn hoặc thành phố
    if (filters.hotelName || filters.city) {
        const hotelQuery = {};

        if (filters.hotelName) {
            hotelQuery.name = { $regex: filters.hotelName, $options: "i" };
        }

        if (filters.city) {
            hotelQuery.address = { $regex: filters.city, $options: "i" };
        }

        const hotels = await Hotel.find(hotelQuery).select("_id");
        const hotelIds = hotels.map(h => h._id);
        query.hotelId = { $in: hotelIds };
    }

    const [data, total] = await Promise.all([
        Room.find(query).skip(skip).limit(limit).lean(),
        Room.countDocuments(query),
    ]);

    // Gán thêm tên khách sạn vào mỗi phòng
    const hotelMap = {};
    if (data.length) {
        const hotelIds = data.map(room => room.hotelId);
        const hotelDocs = await Hotel.find({ _id: { $in: hotelIds } }).select("name");
        hotelDocs.forEach(hotel => {
            hotelMap[hotel._id.toString()] = hotel.name;
        });

        data.forEach(room => {
            room.hotelName = hotelMap[room.hotelId.toString()];
        });
    }

    return { data, total };
};

exports.toggleVisibility = async (roomId) => {
    const room = await Room.findById(roomId);
    if (!room) throw new Error("Không tìm thấy phòng");

    room.status = room.status === "active" ? "inactive" : "active";
    await room.save();
    return room;
};

exports.getRoomById = async (id) => {
    const room = await Room.findById(id).populate("hotelId"); // ✅ populate đúng tên field
    if (!room) throw new Error("Không tìm thấy phòng");
    return room;
};
