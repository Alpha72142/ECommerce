import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="shadow-sm dark:bg-gray-800 p-4">
      <div className="w-full mx-auto flex flex-col md:flex-row items-center justify-between text-center md:text-left px-4">
        <ul className="flex flex-col items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 md:flex-row md:gap-6">
          <li>
            <NavLink to="/about" className="hover:text-black dark:hover:text-white">
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className="hover:text-black dark:hover:text-white">
              Contact
            </NavLink>
          </li>
          <li>
            <NavLink to="/policy" className="hover:text-black dark:hover:text-white">
              Privacy Policy
            </NavLink>
          </li>
        </ul>
        <span className="text-sm text-gray-500 dark:text-gray-400 mt-3 md:mt-0">
          All Rights Reserved © Alphatech™
        </span>
      </div>
    </footer>
  );
};

export default Footer;
