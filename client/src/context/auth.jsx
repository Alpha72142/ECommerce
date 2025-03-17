import { useState, useEffect, createContext, useContext } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  //deault axios
  axios.defaults.headers.common["Authorization"] = auth?.token;

  useEffect(() => {
    const authData = localStorage.getItem("auth");
    if (authData) {
      const parsedData = JSON.parse(authData);
      setAuth({ ...auth, user: parsedData.user, token: parsedData.token });
    }
    // eslint-disable-next-line
  }, []);
  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

//custom hook
const useAuth = () => useContext(AuthContext);

// eslint-disable-next-line
export { useAuth, AuthProvider };
