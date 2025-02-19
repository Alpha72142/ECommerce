import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";

const CreateCategory = () => {
  return (
    <Layout title="Dashboard - Create Category">
      <div className="container">
        <div className="grid grid-rows-1 grid-cols-12 gap-4">
          <div className="col-span-3">
            <AdminMenu />
          </div>
          <div className="col-span-9">
            <div className="max-w-[75%] mt-2 p-6 bg-white border border-gray-200 rounded-lg shadow-sm ">
              <h3 className="mb-2 text-2xl tracking-tight text-gray-900 ">
                CreateCategory
              </h3>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
