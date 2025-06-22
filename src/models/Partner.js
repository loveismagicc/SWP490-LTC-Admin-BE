const mongoose = require("mongoose");

const PartnerSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    taxId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    website: { type: String },
    contactName: { type: String, required: true },
    contactPosition: { type: String },
    description: { type: String },
    businessType: { type: String, required: true },
    licenseFile: {
        originalName: String,
        mimeType: String,
        size: Number,
        buffer: Buffer,
    },
    status: {
        type: String,
        enum: ["pending", "active", "rejected", "banned"],
        default: "pending",
    },
}, { timestamps: true });

module.exports = mongoose.model("Partner", PartnerSchema);
