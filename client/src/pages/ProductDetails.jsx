import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout/Layout";

const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (slug) getProduct();
  }, [slug]);

  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/product/get-single-product/${slug}`
      );
      setProduct(data?.product);
    } catch (error) {
      console.error(error);
    }
  };

  if (!product) {
    return (
      <div className="text-center text-xl font-semibold mt-10">Loading...</div>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-4 md:p-8">
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
                ₹{product.discountPrice}
              </span>
              <span className="text-gray-400 font-semibold text-sm line-through">
                ₹{product.price}
              </span>
            </p>

            {/* Description with "More" / "Less" Toggle */}
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

            {/* More Details Section (Only if expanded) */}
            {showMore && product.brand && (
              <div className="transition-all duration-500 ease-in-out mt-4 p-4 bg-gray-100 border border-gray-300 rounded-lg">
                <p className="text-gray-600">Brand: {product.brand}</p>
                <p className="text-gray-600">Stock: {product.stock}</p>
                <p className="text-gray-600">
                  Manufacturer: {product.manufacturer}
                </p>
                <p className="text-gray-600">Warranty: {product.warranty}</p>
              </div>
            )}

            {/* Add to Cart Button */}
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300">
              ADD TO CART
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
