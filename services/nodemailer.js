import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail", // Gmail SMTP service
  auth: {
    user: process.env.EMAIL, // Your Gmail address
    pass: process.env.EMAIL_PASSWORD, // Your Gmail password or App-specific password (if 2FA is enabled)
  },
});

export const sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL, // From should be the email, not the password
      to: email,
      subject: "Your OTP for Password Reset",
      html: `<p>Your OTP for resetting your password is: <strong>${otp}</strong></p>
               <p>This OTP will expire in 5 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully");
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
};
