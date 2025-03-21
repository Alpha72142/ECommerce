import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

const Spinner = ({ path = "login" }) => {
  const [count, setCount] = useState(2);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevValue) => --prevValue);
    }, 1000);
    count === 0 &&
      navigate(`/${path}`, {
        state: location.pathname,
      });
    return () => clearInterval(interval);
  }, [count, navigate, location, path]);

  return (
    <div className="w-full h-screen items-center block p-6 bg-gray-100 border-gray-100 hover:bg-gray-100">
      <div
        role="status"
        className="flex flex-col gap-6 items-center justify-center w-full h-full"
      >
        <h1 className="text-2xl font-bold text-center  text-gray-200">
          Redirecting you in {count} seconds
        </h1>
        <CircularProgress />

        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

Spinner.propTypes = {
  path: PropTypes.string,
};

export default Spinner;
