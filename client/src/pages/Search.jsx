import { Link } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { useSearch } from "../context/search";
import { IoArrowBackSharp } from "react-icons/io5";
import { Button } from "antd";

const Search = () => {
  const [values] = useSearch();
  const API_URL = import.meta.env.VITE_API_URL;

  return (
    <Layout title="Search Results">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="div flex justify-center">
          <div className="">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-4 py-2 transition"
            >
              <IoArrowBackSharp className="text-lg" />
            </Link>
          </div>
          <div className="text-center mb-6 mx-auto">
            <h1 className="text-2xl font-bold text-gray-800">Search Results</h1>
            <h6 className="text-gray-600 text-lg">
              {values?.results.length < 1
                ? "No products found"
                : `Found ${values?.results.length} products`}
            </h6>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {values?.results.map((p) => (
            <div
              key={p._id}
              className="bg-white hover:shadow-lg rounded-lg overflow-hidden border border-gray-200 transition-transform duration-300 hover:scale-[1.02]"
            >
              {/* Product Image */}
              <div className="relative w-full h-48 bg-white flex items-center justify-center">
                <img
                  src={`${API_URL}/api/v1/product/product-photo/${p._id}`}
                  alt={p.name}
                  className="w-full h-full object-contain p-4"
                />
                {p.discount > 0 && (
                  <span className="absolute top-2 right-2 bg-cyan-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
                    {p.discount}% OFF
                  </span>
                )}
              </div>

              {/* Product Details */}
              <div className="p-4">
                <h5 className="text-md font-semibold text-gray-700 truncate">
                  {p.name}
                </h5>
                <p className="text-sm text-gray-500">
                  {p.description.substring(0, 40)}...
                </p>

                {/* Price Section */}
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-lg font-semibold text-gray-800">
                    ₹{Math.round(p.discountPrice)}
                  </span>
                  {p.discount > 0 && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{p.price}
                    </span>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-2 mt-3">
                  <Link
                    to={`/product/${p.slug}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    More Details
                  </Link>
                  <Button type="primary" className="w-full">
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Search;
