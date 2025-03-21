import { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import CircularProgress from "@mui/material/CircularProgress";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/product/get-product`
      );
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while getting products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout title="Dashboard - Products">
      <div className="container p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <AdminMenu />
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4">
            <div className="mt-2 p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-800">
                All Product List
              </h3>

              {/* Loading Spinner */}
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <CircularProgress />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {products.length > 0 ? (
                    products.map((p) => (
                      <Link
                        to={`/dashboard/admin/product/${p.slug}`}
                        key={p._id}
                        className="rounded-lg bg-gray-100 border border-gray-200 hover:shadow-lg transition-transform duration-300 hover:scale-[1.02]"
                      >
                        <div className="relative h-40 bg-white rounded-t-lg flex justify-center items-center p-2">
                          <img
                            className="rounded-t-lg h-full w-auto object-contain"
                            src={`${
                              import.meta.env.VITE_API_URL
                            }/api/v1/product/product-photo/${
                              p._id
                            }?t=${Date.now()}`}
                            alt={p.name}
                          />
                        </div>

                        <div className="p-4">
                          <h5 className="mb-2 text-md font-bold text-gray-600 truncate">
                            {p.name}
                          </h5>
                          <p className="text-sm text-gray-500 h-14 overflow-hidden">
                            {p.description.substring(0, 60)}...
                          </p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">No Products</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
