import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: {},
      required: true,
    },
    role: {
      type: Number,
      default: 0,
    },
    otp: {
      type: String,
    },
    otpExpireTime: {
      type: Date,
    },
    resetToken: {
      type: String,
    },
    resetTokenExpire: {
      type: Date,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    lastActiveAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("users", userSchema);
