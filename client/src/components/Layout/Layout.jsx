import Header from "./Header";
import Footer from "./Footer";
import PropTypes from "prop-types";
import { Helmet, HelmetProvider } from "react-helmet-async";
import {Toaster} from "react-hot-toast";

const Layout = ({
  children,
  title = "Ecommerce App - shop now",
  description = "Ecommerce App",
  keywords = "Ecommerce, React, JavaScript, Tailwind CSS, Node.js, Express, MongoDB",
  author = "Alphatech",
  className = "" ,
}) => {
  return (
    <HelmetProvider>
      <div className="flex flex-col min-h-screen">
        <Helmet>
          <meta charSet="utf-8" />
          <meta name="description" content={description} />
          <meta name="keywords" content={keywords} />
          <meta name="author" content={author} />
          <title>{title}</title>
        </Helmet>
        <Header />
        <main className={`flex-1 bg-gray-100 p-4 ${className}`}>
          <Toaster />
          {children}
        </main>
        <Footer className="mt-auto" />
      </div>
    </HelmetProvider>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  author: PropTypes.string,
  className: PropTypes.string,
};

export default Layout;
