import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  verifyOTPController,
  resetPasswordController,
  updateProfileController,
  getOrderController,
  getAllOrderController,
  OrderStatusController,
  uploadPhotoController,
  getPhotoController,
  getUsersController,
  getUsersStatsController,
} from "../controllers/authController.js";
import {
  isAdmin,
  isUser,
  requireSignIn,
} from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";


//router object
const router = express.Router();

//routing
//Register || Method POST
router.post("/register", registerController);

// LOGIN || POST
router.post("/login", loginController);

//test routes
router.get("/test", requireSignIn, isAdmin, testController);

router.post("/forgot-password", forgotPasswordController);

// Verify OTP
router.post("/verify-otp", verifyOTPController);

// Reset Password
router.post("/reset-password", resetPasswordController);

//iuser route auth
router.get("/user-auth", requireSignIn, isUser, (req, res) => {
  res.status(200).send({ ok: true });
});

//admin auth route
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//update profile
router.put("/profile", requireSignIn, updateProfileController);

//orders

router.get("/orders", requireSignIn, getOrderController);

//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrderController);

// update order status
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  OrderStatusController
);

// upload photo
router.post("/upload-image/:id", requireSignIn,formidable(), uploadPhotoController);

// get user image
router.get("/user-photo/:id", getPhotoController);

//get users
router.get("/users", requireSignIn, isAdmin, getUsersController);

//get number of users,total revenue ,number of orders, total available product
router.get("/users-stats", requireSignIn, isAdmin, getUsersStatsController); 

export default router;
