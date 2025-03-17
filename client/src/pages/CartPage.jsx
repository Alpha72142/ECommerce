import React from "react";
import Layout from "../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cart, setCart] = useCart();
  const [auth] = useAuth();
  const navigate = useNavigate();

  const removeItem = (pid) => {
    try {
      let myCart = [...cart];
      let idex = myCart.findIndex((item) => item._id === pid);
      myCart.splice(idex, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        {/* Heading Section */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Hello, {auth?.token ? auth?.user?.name : "Guest"}
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            {cart?.length > 0
              ? `You have ${cart.length} item(s) in your cart`
              : "Your cart is empty"}
          </p>
          {!auth?.token && cart.length > 0 && (
            <p className="text-red-500 text-sm mt-1">
              Please login to proceed to checkout
            </p>
          )}
        </div>

        {/* Cart Items & Checkout Section */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 bg-white p-6 shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Cart Items
            </h2>
            {cart.length > 0 ? (
              <ul className="space-y-4">
                {cart.map((item, index) => (
                  <li
                    key={index}
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
                      onClick={() => removeItem()}
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
            <button
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
              onClick={() =>
                auth?.token ? navigate("/checkout") : navigate("/login")
              }
              disabled={cart.length === 0}
            >
              {auth?.token ? "Proceed to Checkout" : "Login to Checkout"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
