import { useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isSending, setIsSending] = useState(false);
  const [timer, setTimer] = useState(0);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const sendOtp = async () => {
    setIsSending(true);
    setTimer(30);
    setMessage("");
    
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/auth/forgot-password`, { email });
      setMessage("OTP sent successfully!");
    } catch (error) {
      setMessage("Failed to send OTP");
      console.error(error);
    }
    
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setIsSending(false);
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const verifyOtp = async () => {
    const enteredOtp = otp.join("");
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/auth/verify-otp`, {
        email,
        otp: enteredOtp,
      });
  
      setMessage(response.data.message);
  
      if (response.status === 200) {
        const { resetToken, resetTokenExpire } = response.data;
        console.log(resetToken, resetTokenExpire);
  
        // Parse the resetTokenExpire into a Date object
        const expireTime = new Date(resetTokenExpire);
  
        // Calculate if the token has expired
        const currentTime = new Date();
        if (expireTime <= currentTime) {
          setMessage("Reset token has expired.");
          return;
        }
  
        // Navigate to reset password page with the resetToken and resetTokenExpire
        navigate("/reset_password", { state: { email, resetToken, resetTokenExpire } });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      setMessage("Invalid OTP or Email");
      console.error(error);
    }
  };
  

  return (
    <Layout>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 ">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>
        
        {message && <p className="text-center text-red-500 mb-2">{message}</p>}
        
        <div className="flex items-center space-x-2">
          
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendOtp}
            disabled={isSending}
            className={`px-4 py-1 text-white text-[12px] rounded-lg transition ${isSending ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
          >
            {isSending ? "Wait" : "Send OTP"}
          </button>
        </div>
        {isSending && <p className="text-center text-gray-500 mt-2">Resend OTP in {timer}s</p>}
        
        <div className="mt-4 flex justify-center space-x-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              className=" md:w-12 ls:w-12 ms:w-10.5 w-8.5 md:h-12 ls:h-12 ms:h-10.5 h-8.5 text-center border rounded-lg text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>
        
        <button
          onClick={verifyOtp}
          className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
        >
          Verify OTP
        </button>
      </div>
    </div>
    </Layout>
  );
}
