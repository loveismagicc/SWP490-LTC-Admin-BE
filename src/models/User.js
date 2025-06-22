const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  phone: { type: String, sparse: true },
  password: { type: String, required: function() { return !this.googleId; } },
  role: {
    type: String,
    enum: ['customer', 'hotel_owner', 'tour_provider', 'admin'],
    default: 'customer',
    required: true
  },
  name: { type: String, required: false },
  profile: {
    avatar: { type: String },
    address: { type: String },
    dateOfBirth: { type: Date },
    updatedAt: { type: Date, default: Date.now }
  },
  googleId: { type: String, sparse: true },
  status: { type: String, enum: ['active', 'pending', 'banned'], default: 'pending' },
  isEmailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  businessType: {
    type: String,
    enum: ['hotel_owner', 'tour_provider'],
    required: function() { return this.role === 'hotel_owner' || this.role === 'tour_provider'; }
  },
  taxId: { type: String, sparse: true },
  businessLicenseImage: { type: String, sparse: true },
  isBusinessVerified: {
    type: Boolean,
    default: false,
    required: function() { return this.role === 'hotel_owner' || this.role === 'tour_provider'; }
  }
}, { timestamps: true });

// So sánh mật khẩu
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hash password nếu cần
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);
