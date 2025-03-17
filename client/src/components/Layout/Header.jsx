import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/shopping_ogo.jpg";
import { useAuth } from "../../context/auth";
import { toast } from "react-hot-toast";
import { FiLogOut } from "react-icons/fi";
import SearchInput from "../Form/SearchInput";
import useCategory from "../hooks/useCategory";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LoginIcon from "@mui/icons-material/Login";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { useCart } from "../../context/cart";
const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const categories = useCategory();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropOpen, setIsDropOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const navigate = useNavigate();

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
  }, []);


  const closeMenu = () => {
    setIsOpen(false);
    setIsDropOpen(false);
    setIsUserOpen(false);
    setIsCategoryOpen(false);
  };

  const handleLogout = () => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth");
    navigate("/login");
    toast.success("Logged out successfully");
  };

  return (
    <nav
      className="w-full px-4 py-1 bg-[#f8f9fb] shadow-md lg:px-8 lg:py-1 navbar-header"
      ref={menuRef}
    >
      <div className="container flex items-center justify-between mx-auto text-slate-800">
        <Link to="/" className="flex items-center">
          <img src={logo} className="w-18" alt="Logo" />
          <div className="text-lg ml-2 font-header">TRENDIFY</div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center">
          <ul className="flex items-center gap-6">
            <SearchInput />
            <li className="p-1 text-sm text-slate-600">
              <NavLink to="/">Home</NavLink>
            </li>
            <li className="relative p-1 text-sm text-slate-600 group">
              <span
                className="cursor-pointer"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              >
                Category
              </span>
              {/* Dropdown for Category (Desktop) */}
              {isCategoryOpen && (
                <div className="absolute z-10 left-0 mt-2 w-48 bg-white shadow-lg rounded-md p-2 ">
                  <Link
                    to={`/categories`}
                    className="block text-[14px] font-medium px-4 py-2 text-gray-900  hover:bg-gray-100"
                  >
                    All CATEGORY
                  </Link>
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.slug}`}
                      className="block text-[12px] px-4 py-2 text-gray-700  hover:bg-gray-100"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </li>
            <li className="p-1 text-sm text-slate-600">
              <NavLink to="/cart">
                <Badge
                  badgeContent={cart.length}
                  color="primary"
                  id="basic-button"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-hidden={open ? "false" : "true"}
                  aria-expanded={open ? "true" : undefined}
                  // onClick={handleClick}
                >
                  Cart
                </Badge>
              </NavLink>
            </li>
            {!auth?.user ? (
              <>
                <li className="p-1 text-sm text-slate-600">
                  <NavLink to="/register">Register</NavLink>
                </li>
                <li className="p-1 text-sm text-slate-600">
                  <NavLink to="/login">Login</NavLink>
                </li>
              </>
            ) : (
              <li className="p-1 text-sm text-slate-600">
                <div
                  onClick={() => setIsUserOpen(!isUserOpen)}
                  className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full bg-gray-600 cursor-pointer"
                >
                  <span className="font-medium text-gray-300">
                    {auth?.user.name[0]}
                  </span>
                </div>
                {isUserOpen && (
                  <div className="absolute right-2 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5">
                    <NavLink
                      to={`/dashboard/${
                        auth?.user?.role === 1 ? "admin" : "user"
                      }`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={closeMenu}
                    >
                      Dashboard
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                    >
                      Logout <FiLogOut />
                    </button>
                  </div>
                )}
              </li>
            )}
          </ul>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-black"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed overflow-y-scroll top-0 left-0 h-full w-64 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform lg:hidden z-50`}
      >
        <button className="absolute top-4 right-4 text-2xl" onClick={closeMenu}>
          ✖
        </button>
        <ul className="flex flex-col p-6 gap-4">
          <li className="p-1 text-sm text-slate-600">
            <NavLink to="/" onClick={closeMenu}>
              Home
            </NavLink>
          </li>
          <li className="relative p-1 text-sm text-slate-600">
            <span
              className="cursor-pointer flex justify-between items-center"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            >
              Category
              <svg
                className={`w-5 h-5 transition-transform ${
                  isCategoryOpen ? "rotate-180" : "rotate-0"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
            {/* Category Dropdown (Mobile) */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isCategoryOpen ? "max-h-100" : "max-h-0"
              }`}
            >
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                  className="block text-[13px] px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={closeMenu}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </li>
          <li className="p-1 text-sm text-slate-600">
            <NavLink to="/cart" onClick={closeMenu}>
              Cart (0)
            </NavLink>
          </li>
          {!auth?.user ? (
            <>
              <li className="p-1 text-sm text-slate-600">
                <NavLink to="/register" onClick={closeMenu}>
                  Register
                </NavLink>
              </li>
              <li className="p-1 text-sm text-slate-600">
                <NavLink to="/login" onClick={closeMenu}>
                  Login
                </NavLink>
              </li>
            </>
          ) : (
            <li className="p-1 text-sm text-slate-600">
              <button
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
                className="w-full text-left"
              >
                Logout <FiLogOut />
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
