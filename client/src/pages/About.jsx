import Layout from "../components/Layout/Layout";
import about_us from "../assets/about_us.jpg";

const About = () => {
  return (
    <Layout title="About Us - Ecommerce app" className="flex justify-center items-center">
      <div className="flex flex-col  bg-gray-100 md:flex-row justify-center items-center gap-2 lg:gap-20 md:gap-10 w-full px-2 md:px-15 lg:px-20">
        {/* Image Section - 50% on larger screens, full width on mobile */}
        <div className="w-full md:w-1/2">
          <img src={about_us} alt="About Us" className="w-full h-auto rounded-md shadow-md" />
        </div>

        {/* Text Section - 50% on larger screens, full width on mobile */}
        <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left">
          <p className="text-slate-700 mt-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, eum?
            Ducimus officiis quia quas, repellat, quod, quos voluptatum.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
