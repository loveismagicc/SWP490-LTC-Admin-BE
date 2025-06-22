const User = require("../models/User");

exports.getUsers = async (page, limit, search) => {
    const skip = (page - 1) * limit;
    const query = search
        ? {
            $or: [
                { username: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { role: { $regex: search, $options: "i" } },
            ],
        }
        : {};

    const [total, data] = await Promise.all([
        User.countDocuments(query),
        User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ]);

    return { total, data };
};

exports.getUserById = async (id) => {
    const user = await User.findById(id);
    if (!user) {
        const error = new Error("Không tìm thấy người dùng.");
        error.statusCode = 404;
        throw error;
    }
    return user;
};

exports.createUser = async (data) => {
    const existing = await User.findOne({ email: data.email });
    if (existing) {
        const error = new Error("Email đã tồn tại.");
        error.statusCode = 400;
        throw error;
    }
    return await User.create(data);
};

exports.updateUser = async (id, data) => {
    const user = await User.findById(id);
    if (!user) {
        const error = new Error("Không tìm thấy người dùng.");
        error.statusCode = 404;
        throw error;
    }

    user.username = data.username;
    user.email = data.email;
    user.role = data.role;
    return await user.save();
};

exports.deleteUser = async (id) => {
    const user = await User.findById(id);
    if (!user) {
        const error = new Error("Người dùng không tồn tại.");
        error.statusCode = 404;
        throw error;
    }
    await user.deleteOne();
};
