import Layout from "../components/Layout/Layout";

const Policy = () => {
  return (
    <Layout title="Privacy Policy">
      <div className="max-w-5xl mx-auto px-6 py-12 bg-gray-100 rounded-lg shadow-md min-h-[calc(100vh-8.55rem)] ">
        <h1 className="text-5xl font-extrabold text-center text-slate-900 mb-6">
          Privacy Policy
        </h1>
        <p className="text-gray-600 text-lg text-center">
          Last updated: <span className="font-semibold">February 9, 2025</span>
        </p>

        {/* Sections */}
        <div className="mt-10 space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 flex items-center">
              🔹 Introduction
            </h2>
            <p className="mt-2">
              Your privacy matters to us. This Privacy Policy explains how we
              collect, use, and protect your information when you use our
              services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 flex items-center">
              🔹 Information We Collect
            </h2>
            <p className="mt-2">
              We collect personal details such as your name, email address, and
              contact information when you interact with our website. We may
              also collect usage data for analytics purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 flex items-center">
              🔹 How We Use Your Information
            </h2>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>To provide and improve our services.</li>
              <li>To communicate updates and promotional offers.</li>
              <li>To analyze website performance and enhance user experience.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 flex items-center">
              🔹 Data Security
            </h2>
            <p className="mt-2">
              We take strong security measures to safeguard your data. However,
              no system is completely foolproof. Always take necessary
              precautions to protect your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 flex items-center">
              🔹 Your Rights
            </h2>
            <p className="mt-2">
              You have the right to access, modify, or delete your personal
              data. If you wish to exercise your rights, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 flex items-center">
              🔹 Contact Us
            </h2>
            <p className="mt-2">
              If you have any questions about our Privacy Policy, feel free to
              reach out at{" "}
              <a
                href="mailto:support@example.com"
                className="text-blue-600 font-semibold hover:underline"
              >
                support@example.com
              </a>
              .
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Your Company Name. All rights reserved.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Policy;
