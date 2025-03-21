import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import moment from "moment";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import { Select } from "antd";
const { Option } = Select;
import CircularProgress from "@mui/material/CircularProgress";

const AdminOrder = () => {
  const [status, setStatus] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ]);
  const [auth] = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getOrders = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/all-orders`
      );
      setOrders(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const handleChange = async (orderId, value) => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/order-status/${orderId}`,
        { status: value }
      );
      getOrders();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title="Dashboard - orders">
      <div className="container adminOrders mx-auto p-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <AdminMenu />
          </div>
          {/* Main Content */}
          <div className="w-full md:w-3/4 bg-white shadow-md rounded-lg p-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Orders
            </h3>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <CircularProgress />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="flex flex-col gap-4">
                  {orders.length > 0 ? (
                    orders.map((order, index) => (
                      <div
                        key={index}
                        className="bg-white  border-1 border-gray-300 p-4 rounded-lg flex flex-col lg:flex-row md:items-start md:gap-6"
                      >
                        {/* Left: Order Details */}
                        <div className="w-full lg:w-1/2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">
                              Order #{index + 1}
                            </span>

                            <Select
                              className="bg-cyan-600 hover:bg-cyan-700 rounded-full !h-7"
                              onChange={(value) =>
                                handleChange(order._id, value)
                              }
                              defaultValue={order?.status}
                              suffixIcon={
                                <svg
                                  className="w-2.5 h-2.5 ml-3  text-white"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 10 6"
                                >
                                  <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="m1 1 4 4 4-4"
                                  />
                                </svg>
                              }
                            >
                              {status.map((s, i) => (
                                <Option
                                  className="bg-white text-gray-600 !text-[11px]"
                                  key={i}
                                  value={s}
                                >
                                  {s}
                                </Option>
                              ))}
                            </Select>
                          </div>
                          {/* Order Details */}
                          <div className="mt-2 text-sm text-gray-600">
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-gray-700 text-sm font-medium">
                                Payment
                              </span>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                                  order?.payment?.success
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                }`}
                              >
                                {order?.payment?.success ? "Success" : "Failed"}
                              </span>
                            </div>
                            <p>
                              <span className="text-sm font-medium">Date:</span>{" "}
                              {moment(order?.createdAt).fromNow()}
                            </p>
                            <p>
                              <span className="text-sm font-medium">
                                Buyer:
                              </span>{" "}
                              {order.buyer?.name}
                            </p>
                            <div className="flex gap-4">
                              <p>
                                <span className="text-sm font-medium">
                                  Products:
                                </span>{" "}
                                {order.products?.length}
                              </p>
                              <p>
                                <span className="text-sm font-medium">
                                  Items:
                                </span>{" "}
                                {order.products?.reduce(
                                  (acc, curr) => acc + curr.quantity,
                                  0
                                )}
                              </p>
                            </div>

                            <p className="text-green-600 font-bold">
                              <span>Total:</span> ₹
                              {order.payment?.transaction?.amount || "N/A"}
                            </p>
                          </div>
                        </div>

                        {/* Right: Product Table */}
                        <div className="w-full  lg:w-1/2 mt-4 md:mt-0 lg:pl-6">
                          <div className="overflow-hidden">
                            <table className="w-full text-xs border border-gray-200">
                              <thead>
                                <tr className="border-b border-gray-400 bg-gray-50">
                                  <th className="px-2 py-1 text-left text-[9px] md:text-[12px]">
                                    Product
                                  </th>
                                  <th className="px-2 py-1 text-right text-[9px] md:text-[12px]">
                                    Price
                                  </th>
                                  <th className="px-2 py-1 text-right text-[9px] md:text-[12px]">
                                    Qty
                                  </th>
                                  <th className="px-2 py-1 text-right text-[9px] md:text-[12px]">
                                    Final
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.products.map((product, i) => (
                                  <tr
                                    key={i}
                                    className="border-b border-gray-200"
                                  >
                                    <td className="px-2 py-2 text-[6px] sm:text-[8px] md:text-[10px]">
                                      {product.name}
                                    </td>
                                    <td className="px-2 py-2 text-[6px] sm:text-[8px] md:text-[10px] text-right text-green-600">
                                      ₹{product.price.toFixed(2)}
                                    </td>
                                    <td className="px-2 py-2 text-[6px] sm:text-[8px] md:text-[10px] text-right font-semibold">
                                      x{product.quantity}
                                    </td>
                                    <td className="px-2 py-2 text-right text-[6px] sm:text-[8px]  md:text-[10px] font-bold">
                                      ₹
                                      {(
                                        product.price * product.quantity
                                      ).toFixed(2)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-6 text-gray-500">
                      No orders found.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrder;
