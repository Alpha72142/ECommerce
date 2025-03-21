import toast from "react-hot-toast";
import { useCart } from "../../context/cart";

export default function useCartAction() {
  const [cart, setCart] = useCart();

  const addToCart = (p) => {
    const existingItemIndex = cart.findIndex((item) => item._id === p._id);

    if (existingItemIndex !== -1) {
      // If item exists, increase orderQuantity
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].orderQuantity =
        (updatedCart[existingItemIndex].orderQuantity || 1) + 1;
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      // If item does not exist, add it with orderQuantity = 1
      const newItem = { ...p, orderQuantity: 1 };
      setCart([...cart, newItem]);
      localStorage.setItem("cart", JSON.stringify([...cart, newItem]));
    }

    toast.success("Item Added to cart");
  };

  return { addToCart };
}
