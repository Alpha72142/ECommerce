import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";

const Dashboard = () => {
  const [auth] = useAuth();
  return (
    <Layout title="Dashboard - Ecommerce App">
      <div className="container p-4 sm:p-6 lg:p-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Dashboard</h1>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <UserMenu />
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4">
            <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
              <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                Welcome, {auth?.user?.name}!
              </h2>
              <div className="p-4 bg-gray-100 rounded-lg">
                <p className="text-md text-gray-700 md:text-lg">
                  <span className="font-semibold">Email:</span>{" "}
                  {auth?.user?.email}
                </p>
                <p className="text-md md:text-lg text-gray-700 mt-2">
                  <span className="font-semibold">Contact:</span>{" "}
                  {auth?.user?.phone}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
