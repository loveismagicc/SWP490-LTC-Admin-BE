const User = require("../models/User");
const bcrypt = require('bcryptjs');

exports.getUsers = async (page, limit, search, filters = {}) => {
    const skip = (page - 1) * limit;

    const andConditions = [];

    if (search) {
        andConditions.push({
            $or: [
                { username: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { role: { $regex: search, $options: "i" } },
            ],
        });
    }

    if (filters.status && Array.isArray(filters.status) && filters.status.length > 0) {
        andConditions.push({
            status: { $in: filters.status },
        });
    }

    if (filters.role && Array.isArray(filters.role) && filters.role.length > 0) {
        andConditions.push({
            role: { $in: filters.role },
        });
    }

    // Gộp query lại
    const finalQuery = andConditions.length > 0 ? { $and: andConditions } : {};

    const [total, data] = await Promise.all([
        User.countDocuments(finalQuery),
        User.find(finalQuery).sort({ createdAt: -1 }).skip(skip).limit(limit),
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

    user.email = data.email;
    user.role = data.role;

    if (data.password && data.password.trim() !== '') {
        user.password = data.password;
    }

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


exports.toggleActive = async (id, status) => {
    const user = await User.findById(id);
    if (!user) {
        const error = new Error("Người dùng không tồn tại");
        error.statusCode = 404;
        throw error;
    }

    user.status = status;
    return await user.save();
};
