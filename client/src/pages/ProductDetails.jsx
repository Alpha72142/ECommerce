import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout/Layout";

const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [relatedProduct, setRelatedProduct] = useState([]);

  useEffect(() => {
    if (slug) getProduct();
  }, [slug]);

  // Get similar products
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

  const addToCart = (product) => {
    console.log("Added to cart:", product);
    // Implement cart functionality here
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
                ₹{product.discountPrice}
              </span>
              <span className="text-gray-400 font-semibold text-sm line-through">
                ₹{product.price}
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
            <button
              onClick={() => addToCart(product)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300"
            >
              ADD TO CART
            </button>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Related Products
          </h2>
          {relatedProduct.length === 0 ? (
            <p className="text-gray-600">No related products found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProduct.map((p) => (
                <div
                  key={p._id}
                  className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 flex flex-col"
                >
                  <img
                    src={`${
                      import.meta.env.VITE_API_URL
                    }/api/v1/product/product-photo/${p._id}`}
                    alt={p.name}
                    className="w-full h-48 object-contain p-2"
                  />
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {p.name}
                    </h3>
                    <p className="text-gray-600">₹{p.discountPrice}</p>
                    <div className="mt-auto">
                      <button className="bg-blue-600 mt-2 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 w-full">
                        ADD TO CART
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
