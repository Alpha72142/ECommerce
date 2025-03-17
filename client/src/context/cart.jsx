import { useState, createContext, useContext, useEffect } from "react";
import PropTypes from "prop-types";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    let exitingCartItem = localStorage.getItem("cart");
    if (exitingCartItem) setCart(JSON.parse(exitingCartItem));
  }, []);

  return (
    <CartContext.Provider value={[cart, setCart]}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

//custom hook
const useCart = () => useContext(CartContext);

// eslint-disable-next-line
export { useCart, CartProvider };
