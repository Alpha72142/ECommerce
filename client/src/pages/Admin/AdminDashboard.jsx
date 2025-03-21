import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import { useState, useEffect } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import {
  FiUsers,
  FiShoppingCart,
  FiPackage,
} from "react-icons/fi";
import { FaIndianRupeeSign } from "react-icons/fa6";
import axios from "axios";

const AdminDashboard = () => {
  const [auth] = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    revenue: 0,
    products: 0,
  });

  
  const userStats = async () => {
    try{
      const {data} = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/auth/users-stats`);
      setStats(data);
    }catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    userStats();
  }, []);

  return (
    <Layout title="Admin Dashboard - Ecommerce App">
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-1/4 w-full">
            <AdminMenu />
          </div>

          {/* Admin Details & Stats */}
          <div className="md:w-3/4 w-full">
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md">
              <Typography
                variant="h4"
                className="!mb-4 text-gray-800 !font-semibold"
              >
                Admin Dashboard
              </Typography>
              <div className="!space-y-3 text-lg text-gray-700">
                <Typography>
                  <strong>Name:</strong> {auth?.user?.name}
                </Typography>
                <Typography>
                  <strong>Email:</strong> {auth?.user?.email}
                </Typography>
                <Typography>
                  <strong>Contact:</strong> {auth?.user?.phone}
                </Typography>
              </div>

              {/* Dashboard Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                <Card className="p-4 flex items-center gap-4 !shadow-none border border-gray-300">
                  <FiUsers className="text-blue-500 text-3xl" />
                  <div>
                    <Typography color="textSecondary">Total Users</Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {stats.totalUsers}
                    </Typography>
                  </div>
                </Card>
                <Card className="p-4 flex items-center gap-4 !shadow-none border-1 border-gray-300">
                  <FiShoppingCart className="text-green-500 text-3xl" />
                  <div>
                    <Typography color="textSecondary">Total Orders</Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {stats.totalOrders}
                    </Typography>
                  </div>
                </Card>
                <Card className="p-4 flex items-center gap-4 !shadow-none border border-gray-300">
                  <FaIndianRupeeSign className="text-yellow-500 text-3xl" />
                  <div>
                    <Typography color="textSecondary">Revenue</Typography>
                    <Typography variant="h5" fontWeight="bold">
                      ₹ {stats.totalRevenue}
                    </Typography>
                  </div>
                </Card>
                <Card className="p-4 flex items-center gap-4 !shadow-none border border-gray-300">
                  <FiPackage className="text-red-500 text-3xl" />
                  <div>
                    <Typography color="textSecondary">
                      Total Products
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {stats.totalProducts}
                    </Typography>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
