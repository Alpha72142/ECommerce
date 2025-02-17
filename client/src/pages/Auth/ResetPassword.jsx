import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, resetToken, resetTokenExpire } = location.state || {}; // Retrieve email, resetToken, and resetTokenExpire

  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [expired, setExpired] = useState(false); // To track expiration status
  const [remainingTime, setRemainingTime] = useState(0); // To track remaining time for countdown

  // Check if the token is expired and show a popup
  useEffect(() => {
    const checkTokenExpiry = () => {
      // Convert resetTokenExpire to a Date object (local time)
      const expiryTime = new Date(resetTokenExpire); // resetTokenExpire should be in ISO format (UTC)
      
      // Log the expiry time and current time for debugging
  
      // Compare expiry time with current time in local time
      const expiryTimeMillis = expiryTime.getTime(); // Expiry time in milliseconds (local time)
      const currentTimeMillis = Date.now(); // Current time in milliseconds (local time)
  
  
      // Calculate the time left
      const timeLeft = expiryTimeMillis - currentTimeMillis;
  
      if (timeLeft <= 0) {
        setExpired(true); // If expired, set expired to true
      } else {
        setRemainingTime(timeLeft); // Set remaining time for countdown
      }
  
      // Timer to update the remaining time every second
      const timerInterval = setInterval(() => {
        const updatedRemainingTime = expiryTimeMillis - Date.now();
        if (updatedRemainingTime <= 0) {
          setExpired(true); // Stop countdown and show expired message
          clearInterval(timerInterval);
        } else {
          setRemainingTime(updatedRemainingTime); // Update the remaining time
        }
      }, 1000);
  
      // Clean up interval when component unmounts
      return () => clearInterval(timerInterval);
    };
  
    if (email && resetToken) {
      checkTokenExpiry(); // Check token validity
    }
  }, [email, resetToken, resetTokenExpire]);
  
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/reset-password`,
        {
          email,
          newPassword,
        }
      );

      setMessage(response.data.message);

      if (response.status === 200) {
        // Redirect to login page after successful password reset
        navigate("/login");
      }
    } catch (error) {
      setMessage("Error resetting password");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle expired token case
  if (expired) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Link Expired</h2>
          <p className="mb-4 text-gray-600">
            This link has expired. Please try again or request a new one.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="text-white bg-blue-500 hover:bg-blue-600 p-3 rounded-md"
          >
            OK
          </button>
        </div>
      </div>
    );
  }

  // Format the remaining time for display (e.g., "02:45")
  const formatTime = (timeInMillis) => {
    const minutes = Math.floor(timeInMillis / 60000);
    const seconds = Math.floor((timeInMillis % 60000) / 1000);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* Timer in top-right corner */}
      <div className="absolute top-4 right-4 p-3 bg-black text-white rounded-md">
        {remainingTime > 0 ? (
          <p>{formatTime(remainingTime)}</p>
        ) : (
          <p>Expired</p>
        )}
      </div>

      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Reset Your Password
        </h2>

        {message && (
          <div className="mb-4 text-center text-red-500">
            <p>{message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password Input */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 mt-4 text-white font-semibold rounded-md ${
                loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
              } focus:outline-none`}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Remembered your password?
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
