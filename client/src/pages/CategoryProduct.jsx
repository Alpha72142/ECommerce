import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "antd";
import CircularProgress from "@mui/material/CircularProgress";
import useCartAction from "../components/hooks/useCartAction";

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCartAction();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (params?.slug) getProductsByCategory();
  }, [params]);

  const getProductsByCategory = async () => {
    setLoading(true); // Start loading
    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/product/product-category/${params.slug}`
      );
      setProducts(data?.products || []); // Ensure it's always an array
      setCategory(data?.category || null);
    } catch (error) {
      console.error("Error fetching category products:", error);
    }
    setLoading(false); // Stop loading
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* ✅ Show Loader While Fetching */}
        {loading ? (
          <div className="flex justify-center items-center h-[50vh]">
            <CircularProgress className="w-12 h-12 text-blue-600" />
          </div>
        ) : category && products.length > 0 ? (
          <>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              {category?.name}
            </h1>

            {/* Product Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="w-full flex flex-col rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-transform duration-300 hover:scale-[1.02] bg-white border border-gray-200"
                >
                  {/* Product Image with Discount Badge */}
                  <div className="relative w-full h-[200px] p-2">
                    <img
                      src={`${API_URL}/api/v1/product/product-photo/${p._id}`}
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
          </>
        ) : (
          <div className="flex justify-center items-center h-[50vh] text-gray-500 text-lg">
            No products available for this category.
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoryProduct;
