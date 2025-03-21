import { compare } from "bcrypt";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import productModel from  "../models/productModel.js";
import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";
import { sendOTPEmail } from "./../services/nodemailer.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import fs from "fs";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    //validation
    if (!name) {
      return res.send({ message: "Name is required" });
    }
    if (!email) {
      return res.send({ message: "Email is required" });
    }
    if (!password) {
      return res.send({ message: "Password is required" });
    }
    if (!phone) {
      return res.send({ message: "Phone is required" });
    }
    if (!address) {
      return res.send({ message: "Address is required" });
    }

    // check user
    const existingUser = await userModel.findOne({ email });

    //if user exists
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Registered please login",
      });
    }
    // register user
    const hashedPassword = await hashPassword(password);

    // save

    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Registered Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in Registeration",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    user.lastActiveAt = new Date();
    await user.save();
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Login Successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt,
        lastActiveAt: user.lastActiveAt,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};

// Generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// Forgot Password
export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email not found" });
    }

    // Generate OTP & Expiry (valid for 5 minutes)
    const otp = generateOTP();
    const exptime = Date.now() + 300000;
    const otpExpire = new Date(Date.now() + 300000);
    console.log(otpExpire, "time exp varify", otpExpire.toLocaleString());

    // Save OTP & Expiry in the database
    user.otp = otp;
    user.otpExpireTime = otpExpire;
    await user.save();

    // Send OTP email
    await sendOTPEmail(user.email, otp);

    res.status(200).json({ message: "OTP sent to your email. Please verify." });
  } catch (error) {
    console.error("Error in Forgot Password:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyOTPController = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpire < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Generate reset token (valid for 15 minutes)
    const resetToken = crypto.randomBytes(32).toString("hex");

    const timestamp = Date.now() + 1 * 60 * 1000;
    const resetTokenExpire = new Date(timestamp);
    console.log(
      resetTokenExpire,
      "time exp otp",
      resetTokenExpire.toLocaleString()
    );

    // Save token & expiry in DB
    user.resetToken = resetToken;
    user.resetTokenExpire = resetTokenExpire;
    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP verified. Redirecting to reset password...",
      resetToken,
      resetTokenExpire,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//test controller
export const resetPasswordController = async (req, res) => {
  const { email, newPassword, resetToken } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.resetToken || user.resetToken !== resetToken) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    if (user.resetTokenExpire < Date.now()) {
      return res.status(400).json({ message: "Reset link has expired" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password & clear reset fields
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//update profile
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    if (password && password.length < 6) {
      return res.json({
        error: "password is required and should be at least 6 characters",
      });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating profile",
      error,
    });
  }
};

//orders
export const getOrderController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products.product", "name price quantity")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting orders",
      error,
    });
  }
};

export const getAllOrderController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products.product", "name price quantity")
      .populate("buyer", "name")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting orders",
      error,
    });
  }
};

// update order status
export const OrderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error while updating order status",
      error,
    });
  }
};

export const testController = (req, res) => {
  res.send("Protected Route");
  console.log("Protected Route");
};

//photo upload
export const uploadPhotoController = async (req, res) => {
  try {
    const { id } = req.params; // Extract user ID from URL params
    const { photo } = req.files; // Get uploaded photo

    if (!photo) {
      return res.status(400).send({ error: "No photo uploaded" });
    }

    if (photo.size > 1000000) {
      return res.status(400).send({ error: "Photo should be less than 1MB" });
    }

    // Find user by ID
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // Save the photo
    user.photo.data = fs.readFileSync(photo.path);
    user.photo.contentType = photo.type;

    await user.save();

    res.status(201).send({
      success: true,
      message: "Photo uploaded successfully",
      user,
    });
  } catch (error) {
    console.error("Upload photo Error:", error);
    res.status(500).send({
      success: false,
      message: "Error uploading photo",
      error: error.message,
    });
  }
};

//get user image
export const getPhotoController = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id).select("photo");

    if (!user || !user.photo.data) {
      return res.status(404).send({ error: "Photo not found" });
    }

    res.set("Content-Type", user.photo.contentType);
    return res.send(user.photo.data);
  } catch (error) {
    console.error("Get photo Error:", error);
    res.status(500).send({
      success: false,
      message: "Error retrieving photo",
      error: error.message,
    });
  }
};

// get all users
export const getUsersController = async (req, res) => {
  try {
    const users = await userModel.find(
      {},
      "_id name email lastActiveAt createdAt"
    );
    res.status(200).send({
      success: true,
      message: "Get all users successfully",
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting users",
      error,
    });
  }
};

//get number of users,total revenue ,number of orders, total available product

export const getUsersStatsController = async (req, res) => {
  try {
    const totalUsers = await userModel.estimatedDocumentCount();
    const totalRevenueResult = await orderModel
      .aggregate([
        {
          $match: {
            "payment.transaction.amount": { $exists: true, $ne: null },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: { $toDouble: "$payment.transaction.amount" },
            },
          },
        },
      ])
      
    
    const totalOrders = await orderModel.estimatedDocumentCount();
    const totalProducts = await productModel.estimatedDocumentCount();

    res.status(200).send({
      success: true,
      totalUsers,
      totalRevenue: totalRevenueResult.length > 0 ? totalRevenueResult[0].totalRevenue : 0,
      totalOrders,
      totalProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error while getting users stats",
      error,
    });
  }
};
