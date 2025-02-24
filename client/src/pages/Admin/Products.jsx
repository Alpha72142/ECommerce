import { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Products = () => {
  const [products, setProducts] = useState([]);

  // get all products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/product/get-product`
      );
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while getting product");
    }
  };

  // life cycle methods
  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout title="Dashboard - Products">
      <div className="container">
        <div className="flex gap-4">
          <div className="w-1/4">
            <AdminMenu />
          </div>
          <div className="w-3/4">
            <div className="mt-2 p-6 bg-white border border-gray-200 rounded-lg shadow-sm ">
              <h3 className="mb-2 text-2xl tracking-tight text-gray-900 ">
                All Product List
              </h3>
              <div className="flex justify-baseline gap-10 flex-wrap mt-10">
                {products.length > 0 ? (
                  products?.map((p) => (
                    <Link
                      to={`/dashboard/admin/product/${p.slug}`}
                      key={p._id}
                      className="w-65 h-80 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
                    >
                      <img
                        className="rounded-t-xl h-3/5"
                        src={`${
                          import.meta.env.VITE_API_URL
                        }/api/v1/product/product-photo/${p._id}`}
                        alt={p.name}
                      />

                      <div className="p-4">
                        <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                          {p.name}
                        </h5>

                        <p className="mb-4 h-14 font-normal text-sm text-gray-700 dark:text-gray-400 line-clamp-3">
                          {p.description}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p>No Products</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
