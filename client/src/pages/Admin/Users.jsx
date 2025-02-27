import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";

const Users = () => {
  return (
    <Layout title="Dashboard - Users">
      <div className="container p-4">
        <div className="flex gap-4">
          <div className="w-1/4">
            <AdminMenu />
          </div>
          <div className="w-3/4">
            <div className="mt-2 p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
              <h3 className="text-3xl font-semibold text-gray-800">
                All Users
              </h3>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
