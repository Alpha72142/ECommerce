import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
const AdminDashboard = () => {
  const { auth } = useAuth();
  return (
    <Layout title="Admin Dashboard - Ecommerce app">
      <div className="container">
        <div className="grid grid-rows-1 grid-cols-12 gap-4">
          <div className="col-span-3">
            <AdminMenu />
          </div>
          <div className="col-span-9">
            <div className="max-w-[75%] p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <h3 className="mb-2 text-2xl tracking-tight text-gray-900 dark:text-white">Admin Name : {auth?.user?.name}</h3>
            <h3 className="mb-2 text-2xl tracking-tight text-gray-900 dark:text-white">Admin Email : {auth?.user?.email}</h3>
            <h3 className="mb-2 text-2xl tracking-tight text-gray-900 dark:text-white">Admin Contact : {auth?.user?.phone}</h3>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
