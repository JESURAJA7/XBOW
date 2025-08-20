import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number']
  },
  whatsappNumber: {
    type: String,
    required: [true, 'WhatsApp number is required'],
    match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian WhatsApp number']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['load_provider', 'vehicle_owner', 'admin'],
    required: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  profileCompleted: {
    type: Boolean,
    default: false
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'inactive', 'trial', 'expired'],
    default: 'inactive'
  },
  subscriptionEndDate: Date,
  trialDays: {
    type: Number,
    default: 0
  },
  paymentHistory: [{
    amount: Number,
    paymentId: String,
    status: String,
    date: { type: Date, default: Date.now }
  }],
  companyName: String,
  companyAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  gstNumber: String,
  panNumber: String,
  businessType: {
    type: String,
    enum: ['manufacturer', 'trader', 'logistics', 'other']
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    landmark: String
  },
  businessDetails: {
    companyName: String,
    businessType: String,
    gstNumber: String,
    panNumber: String,
    registrationNumber: String
  },
  ownerType: {
    type: String,
    enum: ['individual', 'company']
  },
  licenseNumber: String,
  licenseExpiry: Date,
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    accountHolderName: String
  },
  documents: [{
    type: {
      type: String,
      enum: ['pan', 'aadhar', 'license', 'gst', 'rc_book', 'vehicle_photo', 'other']
    },
    url: String,
    publicId: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  totalLoadsPosted: { type: Number, default: 0 },
  totalVehicles: { type: Number, default: 0 },
  preferredOperatingState: String,
  preferredOperatingDistrict: String,
  subscriptionFee: { type: Number, default: 1000 },
  subscriptionFeePerVehicle: { type: Number, default: 1000 }
}, {
  timestamps: true
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
