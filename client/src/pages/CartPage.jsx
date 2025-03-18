import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import toast from "react-hot-toast";

const CartPage = () => {
  const [cart, setCart] = useCart();
  const [auth] = useAuth();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getToken = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/product/braintree/token`
        );
        setClientToken(data?.clientToken);
      } catch (error) {
        console.error("Error fetching client token:", error);
      }
    };
    if (auth?.token) getToken();
  }, [auth?.token]);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/product/braintree/payment`,
        { nonce, cart }
      );
        setLoading(false)
        localStorage.removeItem("cart");
        setCart([]);
        navigate("/dashboard/user/orders");
        toast.success('Payment completed successfully')
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
      setLoading(false);
    } 
  };

  const removeItem = (pid) => {
    try {
      let updatedCart = cart.filter((item) => item._id !== pid);
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Hello, {auth?.token ? auth?.user?.name : "Guest"}
          </h1>
          <p className="text-lg text-gray-600 mt-1">
            {cart.length > 0
              ? `You have ${cart.length} item(s) in your cart`
              : "Your cart is empty"}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 bg-white p-6 shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Cart Items
            </h2>
            {cart.length > 0 ? (
              <ul className="space-y-4">
                {cart.map((item) => (
                  <li
                    key={item._id}
                    className="flex justify-between items-center p-4 border rounded-lg shadow-sm bg-gray-50"
                  >
                    <div className="flex items-center">
                      <img
                        src={`${
                          import.meta.env.VITE_API_URL
                        }/api/v1/product/product-photo/${item._id}`}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <p className="text-gray-400 text-sm">
                          {item.description}
                        </p>
                        <p className="text-gray-600">${item.price}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item._id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No items in your cart.</p>
            )}
          </div>

          {/* Checkout Section */}
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Checkout
            </h2>
            <p className="text-lg font-semibold">
              Total: $
              {cart.reduce((total, item) => total + item.price, 0).toFixed(2)}
            </p>
            {auth?.user?.address && (
              <div className="mt-4">
                <h4 className="text-lg font-semibold">Current Address</h4>
                <p className="text-gray-700">{auth.user.address}</p>
                <button
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm underline"
                  onClick={() => navigate("/dashboard/user/profile")}
                >
                  Update Address
                </button>
              </div>
            )}
            <button
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
              onClick={() => {
                setShowPayment(true)
                if (!auth?.token) {
                  navigate("/login");
                }
              }}
              disabled={cart.length === 0}
            >
              {auth?.token ? "Proceed to Checkout" : "Login to Checkout"}
            </button>

            {showPayment && clientToken && (
              <div className="mt-4">
                <DropIn
                  options={{
                    authorization: clientToken,
                    googlePay: { flow: "vault" },
                    
                  }}
                  onInstance={(instance) => setInstance(instance)}
                />
                <button
                  onClick={handlePayment}
                  disabled={loading || !instance || !auth?.user?.address}
                  className="w-full mt-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200"
                >
                  {loading ? "Processing..." : "Make Payment"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
