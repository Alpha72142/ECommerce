import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
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
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment completed successfully");
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
  const updateQuantity = (pid, change) => {
    const updatedCart = cart.map((item) =>
      item._id === pid
        ? { ...item, orderQuantity: Math.max(1, item.orderQuantity + change) }
        : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <div className="mb-6 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Hello, {auth?.token ? auth?.user?.name : "Guest"}
          </h1>
          <p className="text-sm md:text-lg text-gray-600 mt-1">
            {cart.length > 0
              ? `You have ${cart.length} item(s) in your cart`
              : "Your cart is empty"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="md:col-span-2 bg-white p-6 shadow-lg rounded-lg">
            <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mb-4">
              Cart Items
            </h2>
            {cart.length > 0 ? (
              <ul className="space-y-4">
                {cart.map((item) => (
                  <li
                    key={item._id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-300 rounded-lg"
                  >
                    <div className="flex items-center flex-wrap">
                      <img
                        src={`${
                          import.meta.env.VITE_API_URL
                        }/api/v1/product/product-photo/${item._id}`}
                        alt={item.name}
                        className="w-20 h-20 object-content p-2 rounded-md"
                      />
                      <div className="ml-4 w-[75%]">
                        <h3 className="text-base md:text-lg font-semibold">
                          {item.name}
                        </h3>
                        <p className="w-full text-gray-400 text-xs md:text-sm line-clamp-2">
                          {item.description}
                        </p>
                        <p className="text-gray-600">
                          ₹{(item.price * item.orderQuantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-row gap-2 mt-4 md:mt-0">
                      {/* Quantity Controls */}
                      <div className="relative flex items-center max-w-[6rem] border border-gray-300 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item._id, -1)}
                          disabled={item.orderQuantity <= 1}
                          className="bg-gray-100 hover:bg-gray-200 p-3 h-9 flex items-center"
                        >
                          -
                        </button>
                        <input
                          type="text"
                          value={item.orderQuantity}
                          readOnly
                          className="bg-gray-50 border-x-0 h-9 text-center w-9"
                        />
                        <button
                          onClick={() => updateQuantity(item._id, 1)}
                          className="bg-gray-100 hover:bg-gray-200 p-3 h-9 flex items-center"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <MdDelete className="text-2xl" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No items in your cart.</p>
            )}
          </div>

          {/* Checkout Section */}
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mb-4">
              Checkout
            </h2>
            <p className="text-sm md:text-lg font-semibold">
              Total: ₹
              <span className="text-amber-700 ml-2">
                {cart
                  .reduce(
                    (total, item) => total + item.price * item.orderQuantity,
                    0
                  )
                  .toFixed(2)}
              </span>
            </p>
            {auth?.user?.address && (
              <div className="mt-4">
                <h4 className="text-sm md:text-lg font-semibold">
                  Current Address
                </h4>
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
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 text-sm md:text-base"
              onClick={() => {
                setShowPayment(true);
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
                  className="w-full mt-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200 text-sm md:text-base"
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
