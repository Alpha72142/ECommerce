import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout/Layout";

const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [relatedProduct, setRelatedProduct] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (slug) getProduct();
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, [slug]);

  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProduct(data?.products || []);
    } catch (error) {
      console.error(error);
    }
  };

  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/product/get-single-product/${slug}`
      );
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.error(error);
    }
  };

  const addToCart = (p) => {
    const existingItemIndex = cart.findIndex((item) => item._id === p._id);
    let updatedCart = [...cart];

    if (existingItemIndex !== -1) {
      updatedCart[existingItemIndex].orderQuantity += 1;
    } else {
      updatedCart.push({ ...p, orderQuantity: 1 });
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const updateQuantity = (p, type) => {
    const existingItemIndex = cart.findIndex((item) => item._id === p._id);
    let updatedCart = [...cart];

    if (existingItemIndex !== -1) {
      if (type === "increase") {
        updatedCart[existingItemIndex].orderQuantity += 1;
      } else if (type === "decrease") {
        if (updatedCart[existingItemIndex].orderQuantity > 1) {
          updatedCart[existingItemIndex].orderQuantity -= 1;
        } else {
          updatedCart.splice(existingItemIndex, 1);
        }
      }
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  const getQuantity = (p) => {
    const item = cart.find((item) => item._id === p._id);
    return item ? item.orderQuantity : 0;
  };

  if (!product) {
    return (
      <div className="text-center text-xl font-semibold mt-10">Loading...</div>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Product Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white shadow-lg rounded-2xl p-6">
          <div className="flex justify-center">
            <img
              src={`${
                import.meta.env.VITE_API_URL
              }/api/v1/product/product-photo/${product._id}`}
              alt={product.name}
              className="rounded-xl max-h-96 w-auto object-contain"
            />
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-lg text-gray-600">
              Category:{" "}
              <span className="font-semibold">{product?.category?.name}</span>
            </p>
            <p className="flex items-center gap-2 text-lg text-gray-600">
              Price:
              <span className="text-green-600 font-semibold">
                ₹ {Math.round(product.discountPrice)}
              </span>
              <span className="text-gray-400 font-semibold text-sm line-through">
                {product.discount ? ` ₹ ${product.price}` : ""}
              </span>
            </p>
            <p className="text-gray-700">
              {showMore
                ? product.description
                : `${product.description.slice(0, 300)}`}
              <span
                className="text-blue-600 cursor-pointer font-semibold ml-1"
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? " Less" : " ...More"}
              </span>
            </p>

            {getQuantity(product) > 0 ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => updateQuantity(product, "decrease")}
                  className="bg-red-500 text-white px-3 py-2 rounded-lg"
                >
                  -
                </button>
                <span className="text-lg font-semibold">
                  {getQuantity(product)}
                </span>
                <button
                  onClick={() => updateQuantity(product, "increase")}
                  className="bg-green-500 text-white px-3 py-2 rounded-lg"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(product)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300"
              >
                ADD TO CART
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
