import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";

const Dashboard = () => {
  const { auth } = useAuth();
  return (
    <Layout title="Dashboard - Ecommerce app">
      <div className="container">
        <div className="grid grid-rows-1 grid-cols-12 gap-4">
          <div className="col-span-3">
            <UserMenu />
          </div>
          <div className="col-span-9">
            <div className="max-w-[75%] p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="mb-2 text-2xl tracking-tight text-gray-900">Name : {auth?.user?.name}</h3>
            <h3 className="mb-2 text-2xl tracking-tight text-gray-900">Email : {auth?.user?.email}</h3>
            <h3 className="mb-2 text-2xl tracking-tight text-gray-900">Contact : {auth?.user?.phone}</h3>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
