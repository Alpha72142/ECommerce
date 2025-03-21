import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout/Layout";
import useCartAction from "../components/hooks/useCartAction";
import { Button } from "antd";
import { CircularProgress } from "@mui/material";


const ProductDetails = () => {
   const navigate = useNavigate();
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [relatedProduct, setRelatedProduct] = useState([]);
 const { addToCart } = useCartAction();
  useEffect(() => {
    if (slug) getProduct();
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

  if (!product) {
    return (
      <div className="h-screen flex justify-center items-center"><CircularProgress/></div>
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
              {product.description.length > 300 ? (
                <>
                  {showMore
                    ? product.description
                    : `${product.description.slice(0, 300)}...`}
                  <span
                    className="text-blue-600 cursor-pointer font-semibold ml-1"
                    onClick={() => setShowMore(!showMore)}
                  >
                    {showMore ? " Less" : " More"}
                  </span>
                </>
              ) : (
                product.description
              )}
            </p>

            <button
              onClick={() => addToCart(product)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300"
            >
              ADD TO CART
            </button>
          </div>
        </div>
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
                  className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 flex flex-col flex-grow"
                >
                  <div className="relative w-full h-[200px] p-2">
                    <img
                      src={`${
                        import.meta.env.VITE_API_URL
                      }/api/v1/product/product-photo/${p._id}`}
                      alt={p.name}
                      className="w-full h-full object-contain p-2"
                    />
                    {p.discount > 0 && (
                      <span className="absolute top-0 right-0 bg-cyan-500 text-white text-xs font-semibold px-2 py-1 rounded-bl-lg">
                        {p.discount}% OFF
                      </span>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="p-4">
                    <h5 className="text-md font-bold text-gray-600 truncate">
                      {p.name}
                    </h5>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {p.description}
                    </p>

                    {/* Pricing */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-bold text-gray-700">
                        ₹ {Math.round(p.discountPrice)}
                      </span>
                      {p.discount > 0 && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹ {p.price}
                        </span>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                      <Button
                        className="text-blue-700 font-medium border-blue-500 hover:bg-blue-100 w-full"
                        onClick={() => navigate(`/product/${p.slug}`)}
                      >
                        More Details
                      </Button>
                      <Button
                        type="primary"
                        className="w-full"
                        onClick={() => addToCart(p)}
                      >
                        Add to Cart
                      </Button>
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
