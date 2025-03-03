import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/shopping_ogo.jpg";
import { useAuth } from "../../context/auth";
import { toast } from "react-hot-toast";
import { FiLogOut } from "react-icons/fi";
import SearchInput from "../Form/SearchInput";

const Header = () => {
  const { auth, setAuth } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropOpen, setIsDropOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const navigate = useNavigate();

  const closeMenu = () => {
    setIsOpen(false);
    setIsDropOpen(false);
    setIsUserOpen(false);
  };

  // Function to close dropdown when an option is clicked

  const handleLogout = () => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth");
    navigate("/login");
    toast.success("Logged out successfully");
  };

  return (
    <nav className="w-full px-4 py-1 bg-[#f8f9fb] shadow-md lg:px-8 lg:py-1 navbar-header">
      <div className="container flex items-center justify-between mx-auto text-slate-800">
        <Link to="/" className="flex items-center">
          <img src={logo} className="w-18" alt="Logo" />
          <div className="text-lg ml-2 font-header">TRENDIFY</div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center">
          <ul className="flex items-center gap-6">
            <SearchInput/>
            {[
              { path: "/", label: "Home" },
              { path: "/category", label: "Category" },
              { path: "/cart", label: "cart (0)" },
            ].map((item) => (
              <li key={item.path} className="p-1 text-sm text-slate-600 flex items-center">
                <NavLink
                  to={item.path}
                  className={
                    ({ isActive }) =>
                      `relative px-1 py-2 transition-all duration-300 before:absolute before:left-0 before:bottom-0 
                    before:h-[2px] before:w-full before:bg-black 
                    ${isActive ? "before:scale-x-100" : "before:scale-x-0"}` // Apply border only for active
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}

            {!auth.user ? (
              <>
                <li className="p-1 text-sm text-slate-600">
                  <NavLink
                    to="/register"
                    className={
                      ({ isActive }) =>
                        `relative px-1 py-2 transition-all duration-300 before:absolute before:left-0 before:bottom-0 
                      before:h-[2px] before:w-full before:bg-black 
                      ${isActive ? "before:scale-x-100" : "before:scale-x-0"}` // Apply border only for active
                    }
                  >
                    Register
                  </NavLink>
                </li>
                <li className="p-1 text-sm text-slate-600">
                  <div className="relative inline-block text-left">
                    <span
                      className="relative inline-flex w-full gap-x-1.5 cursor-pointer"
                      id="menu-button"
                      aria-haspopup="true"
                      onClick={() => setIsDropOpen(!isDropOpen)}
                    >
                      Login
                      <svg
                        className={`-mr-1 size-5 text-gray-400 ${
                          isDropOpen ? "transform scale-y-[-1]" : ""
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        data-slot="icon"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>

                    {/* Dropdown menu */}
                    {isDropOpen && (
                      <div
                        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="menu-button"
                        tabIndex={-1}
                      >
                        <div className="py-1" role="none">
                          <NavLink
                            to="/login"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={closeMenu}
                          >
                            User
                          </NavLink>
                          <NavLink
                            to="/login"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={closeMenu}
                          >
                            Admin
                          </NavLink>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              </>
            ) : (
              <li className="p-1 text-sm text-slate-600">
                <div
                  onClick={() => setIsUserOpen(!isUserOpen)}
                  className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full bg-gray-600"
                >
                  <span className="font-medium text-gray-300">
                    {auth.user.name[0]} 
                  </span>
                </div>
                {isUserOpen && (
                  <div
                    className="absolute right-2 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                    tabIndex={-1}
                  >
                    <div className="py-1" role="none">
                      <NavLink
                        to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={closeMenu}
                      >
                        Dashboard
                      </NavLink>

                      <NavLink
                        onClick={(e) => {
                          e.preventDefault(); // Prevent NavLink's default behavior
                          handleLogout(); // Call logout function
                        }}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                      >
                        Logout
                        <FiLogOut/>
                      </NavLink>
                    </div>
                  </div>
                )}
              </li>
            )}
          </ul>
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="lg:hidden p-2 text-black"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>

        {/* Sidebar Menu */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform lg:hidden z-50`}
        >
          <button
            className="absolute top-4 right-4 text-2xl"
            onClick={closeMenu}
          >
            ✖
          </button>
          <ul className="flex flex-col p-6 gap-4">
            <div className="relative inline-flex items-center justify-center w-18 h-18 mx-auto overflow-hidden rounded-full bg-gray-600">
              <span className="font-medium text-gray-300">
                JL
              </span>
            </div>
            {[
              { path: "/", label: "Home" },
              {path: `/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`, label: "Dashboard"},
              { path: "/category", label: "Category" },
              { path: "/cart", label: "cart (0)" },
            ].map((item) => (
              <li key={item.path} className="p-1 text-sm text-slate-600">
                <NavLink
                  to={item.path}
                  className={
                    ({ isActive }) =>
                      `relative px-4 py-2 transition-all duration-300 before:absolute before:left-0 before:bottom-0 
                    before:h-[2px] before:w-full before:bg-black 
                    ${isActive ? "before:scale-x-100" : "before:scale-x-0"}` // Conditional border
                  }
                  onClick={closeMenu}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            {!auth.user ? (
              <>
                <li className="p-1 text-sm text-slate-600">
                  <NavLink
                    to="/register"
                    className={
                      ({ isActive }) =>
                        `relative px-4 py-2 transition-all duration-300 before:absolute before:left-0 before:bottom-0 
                      before:h-[2px] before:w-full before:bg-black 
                      ${isActive ? "before:scale-x-100" : "before:scale-x-0"}` // Conditional border
                    }
                    onClick={closeMenu}
                  >
                    Register
                  </NavLink>
                </li>
                <li className="p-1 text-sm text-slate-600">
                  <div className="relative inline-block px-4">
                    <span
                      className="relative inline-flex w-full gap-x-1.5 cursor-pointer"
                      id="menu-button"
                      aria-haspopup="true"
                      onClick={() => setIsDropOpen(!isDropOpen)}
                    >
                      Login
                      <svg
                        className={`-mr-1 size-5 text-gray-400 ${
                          isDropOpen ? "transform scale-y-[-1]" : ""
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        data-slot="icon"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>

                    {/* Dropdown menu */}
                    {isDropOpen && (
                      <div
                        className="absolute z-10 mt-2 w-40 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="menu-button"
                        tabIndex={-1}
                      >
                        <div className="py-1" role="none">
                          <NavLink
                            to="/login"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={closeMenu}
                          >
                            User
                          </NavLink>
                          <NavLink
                            to="/login"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={closeMenu}
                          >
                            Admin
                          </NavLink>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              </>
            ) : (
              <li className="p-1 text-sm text-slate-600">
                <NavLink
                  onClick={(e) => {
                    e.preventDefault(); // Prevent NavLink's default behavior
                    handleLogout(); // Call logout function
                  }}
                  className="relative px-4 py-2 flex items-center justify-between"
                >
                  Logout
                  <FiLogOut/>
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
