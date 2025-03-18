import { useState } from "react";
import Layout from "../../components/Layout/Layout";
import { FaGoogle, FaFacebookF, FaEye, FaEyeSlash } from "react-icons/fa";
import registerImg from "../../assets/image.jpg"; // Replace with your registration image
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle registration logic here
    console.log({ name, email, password, phone, address });

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/register`,
        { name, email, password, phone, address }
      );
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };


  return (
    <Layout title="Register - Ecommerce App">
      {/* Flexbox to stretch content between Navbar and Footer */}
      <div className="flex justify-center items-center px-4 py-6 bg-gray-100 min-h-[calc(100vh-6rem)]">
        <div className="relative flex flex-col md:flex-row bg-white shadow-lg rounded-2xl max-w-2xl w-full">
          {/* Left Side (Form Section) */}
          <div className="w-full md:w-1/2 flex flex-col justify-center p-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
              Create an Account
            </h2>
            <p className="text-gray-500 text-center mt-2">
              Join us and start shopping today
            </p>

            <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
              {/* Name Input */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <label className="block text-gray-700 font-medium">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute top-9 right-4 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Phone Input */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Address Input */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your address"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Register Button */}
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all">
                Register
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-gray-500 bg-white px-4">
                <span className="bg-white px-2">OR</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="flex gap-4">
              <button className="w-1/2 flex items-center justify-center border py-2 rounded-lg hover:bg-gray-100">
                <FaGoogle className="text-red-500 mr-2" /> Google
              </button>
              <button className="w-1/2 flex items-center justify-center border py-2 rounded-lg hover:bg-gray-100">
                <FaFacebookF className="text-blue-600 mr-2" /> Facebook
              </button>
            </div>

            {/* Login Link */}
            <p className="text-center text-gray-600 mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>

          {/* Right Side (Image Section) */}
          <div className="w-full md:w-1/2 justify-center items-center hidden sm:flex">
            <img
              src={registerImg}
              alt="Register Illustration"
              className="w-full h-full max-w-xs md:max-w-sm rounded-r-2xl"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
