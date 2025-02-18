import Layout from "../components/Layout/Layout";
import contact_us from "../assets/contact_us.jpg";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import WifiCalling3OutlinedIcon from "@mui/icons-material/WifiCalling3Outlined";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";

const Contact = () => {
  return (
    <Layout title="Contact Us - Ecommerce app" className="flex justify-center items-center">
    
      <div className="flex flex-col  md:flex-row  bg-gray-100 justify-center items-center gap-8 max-w-6xl mx-auto px-4">
        {/* Image Section - 60% on larger screens, full width on mobile */}
        <div className="w-full md:w-3/5 hidden md:block">
          <img src={contact_us} alt="Contact Us" className="w-full h-auto rounded-md shadow-md " />
        </div>

        {/* Contact Info Section - 40% on larger screens, full width on mobile */}
        <div className="w-full md:w-2/5 flex flex-col justify-center text-center md:text-left">
          <h1 className="text-4xl text-center md:text-4xl lg:text-5xl text-white bg-slate-900 p-3 rounded-md">
            Contact Us
          </h1>
          <p className="text-slate-700 mt-4 lg">
            Any queries and info about the product? Feel free to call anytime, we are available 24x7.
          </p>

          <div className="flex flex-col gap-3 mt-6">
            <div className="flex items-center justify-center md:justify-start">
              <MailOutlineIcon />
              <p className="text-slate-700 ml-2">www.help@ecommerce.com</p>
            </div>
            <div className="flex items-center justify-center md:justify-start">
              <WifiCalling3OutlinedIcon />
              <p className="text-slate-700 ml-2">022-3246433</p>
            </div>
            <div className="flex items-center justify-center md:justify-start">
              <HeadsetMicOutlinedIcon />
              <p className="text-slate-700 ml-2">1800-4372-0000 (toll free)</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
