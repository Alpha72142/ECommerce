import Layout from "../components/Layout/Layout";
import { Link } from "react-router-dom";

const Pagenotfound = () => {
  return (
    <Layout title="404 - Page not found">
      <div className="flex h-100 flex-col items-center justify-center">
          <h1 className="text-8xl font-bold text-red-500">404</h1>
          <h2 className="mt-2 text-2xl text-gray-600">Oops ! Page not found</h2>
          <Link to="/" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">Go Back</Link>
      </div>
    </Layout>
  );
};

export default Pagenotfound;
