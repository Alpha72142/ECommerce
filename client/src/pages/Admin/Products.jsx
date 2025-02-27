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
      <div className="container p-4">
        <div className="flex gap-4">
          <div className="w-1/4">
            <AdminMenu />
          </div>
          <div className="w-3/4">
            <div className="mt-2 p-6 bg-white border border-gray-200 rounded-lg shadow-lg ">
              <h3 className="text-3xl font-semibold text-gray-800">
                All Product List
              </h3>
              <div className="flex justify-baseline gap-10 flex-wrap mt-10">
                {products.length > 0 ? (
                  products?.map((p) => (
                    <Link
                      to={`/dashboard/admin/product/${p.slug}`}
                      key={p._id}
                      className="w-65 h-78 rounded-lg bg-gray-100 border border-gray-200 hover:shadow-lg"
                    >
                      <div className="relative h-3/5 bg-white rounded-t-lg flex justify-around p-1">
                        <img
                          className="rounded-t-lg h-full p-2"
                          src={`${
                            import.meta.env.VITE_API_URL
                          }/api/v1/product/product-photo/${
                            p._id
                          }?t=${Date.now()}`}
                          alt={p.name}
                        />
                      </div>

                      <div className="p-4">
                        <div className="relative w-full overflow-hidden">
                          <h5 className="animate-marquee mb-2 text-md font-bold tracking-tight text-gray-600  whitespace-nowrap transition-transform duration-500 ease-in-out group-hover:-translate-x-1/2">
                            {p.name}
                          </h5>
                        </div>

                        <p className="mb-4 h-14 font-normal text-sm text-gray-500 ">
                          {p.description.substring(0, 60)}...
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
