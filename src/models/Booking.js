const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        hotelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
        roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true }, // <-- thêm field này
        details: {
            checkInDate: { type: Date, required: true },
            checkOutDate: { type: Date, required: true },
            numberOfPeople: { type: Number, required: true },
            roomType: { type: String, required: true },
            specialRequests: { type: String },
        },
        totalPrice: { type: Number, required: true },
        type: { type: String, enum: ["online", "offline"], default: "online" },
        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled", "completed"],
            default: "pending",
        },
        commissionAmount: { type: Number, default: 0 },
        netPayoutAmount: { type: Number, default: 0 },
        paymentLink: { type: String },
        paymentInfo: {
            bookingCode: { type: String },
            paymentMethod: { type: String },
            payoutStatus: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
