import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  verifyOTPController,
  resetPasswordController,
} from "../controllers/authController.js";
import { isAdmin, isUser, requireSignIn } from "../middlewares/authMiddleware.js";

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

export default router;
