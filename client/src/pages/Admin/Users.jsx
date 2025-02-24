import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";

const Users = () => {
  return (
    <Layout title="Dashboard - Users">
      <div className="container">
        <div className="flex gap-4">
          <div className="w-1/4">
            <AdminMenu />
          </div>
          <div className="w-3/4">
            <div className="mt-2 p-6 bg-white border border-gray-200 rounded-lg shadow-sm ">
            <h3 className="mb-2 text-2xl tracking-tight text-gray-900 ">
                All Users
              </h3></div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
