import { useState } from "react";
import Layout from "../../components/Layout/Layout";
import { FaGoogle, FaFacebookF, FaEye, FaEyeSlash } from "react-icons/fa";
import loginImg from "../../assets/image.jpg";
import { Link, useNavigate, useLocation, NavLink } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../../context/auth";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [auth, setAuth] = useAuth();

  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/login`,
        { email, password }
      );
      if (res && res?.data?.success) {
        toast.success(res.data.message);
        setAuth({ ...auth, user: res.data.user, token: res.data.token });
        localStorage.setItem("auth", JSON.stringify(res.data));
        navigate(location.state || "/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Layout title="Login - Ecommerce App">
      <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
        <div className="relative flex flex-col md:flex-row bg-white shadow-lg rounded-2xl max-w-2xl w-full">
          {/* Left Side (Form Section) */}
          <div className="w-full p-4 md:w-1/2 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              Welcome Back!
            </h2>
            <p className="text-gray-500 text-center mt-2">
              Login to continue shopping
            </p>

            <form className="mt-6" onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute top-1/3 items-center right-4 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex justify-between items-center mb-6">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-gray-600">Remember Me</span>
                </label>
                <NavLink
                  to="/forgot_password"
                  className="text-blue-600 hover:underline"
                >
                  Forgot Password?
                </NavLink>
              </div>

              {/* Login Button */}
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all">
                Sign In
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t"></div>
                </div>
                <div className="relative flex justify-center text-gray-500 bg-white px-4">
                  <span className="bg-white px-2">OR</span>
                </div>
              </div>

              {/* Social Login */}
              <div className="flex gap-4">
                <button className="w-1/2 flex items-center justify-center border py-3 rounded-lg hover:bg-gray-100">
                  <FaGoogle className="text-red-500 mr-2" /> Google
                </button>
                <button className="w-1/2 flex items-center justify-center border py-3 rounded-lg hover:bg-gray-100">
                  <FaFacebookF className="text-blue-600 mr-2" /> Facebook
                </button>
              </div>

              {/* Sign Up Link */}
              <p className="text-center text-gray-600 mt-6">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </form>
          </div>

          {/* Right Side (Image Section) */}
          <div className="w-full md:w-1/2 hidden sm:block">
            <img
              src={loginImg}
              alt="Login Illustration"
              className="w-full max-w-sm h-full rounded-r-2xl"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
