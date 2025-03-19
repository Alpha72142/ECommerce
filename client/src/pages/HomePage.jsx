import { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { Checkbox, InputNumber, Button, Radio } from "antd";
import { Price } from "../components/Price";
import { Link, useNavigate } from "react-router-dom";
import { FaAnglesDown } from "react-icons/fa6";
import CircularProgress from "@mui/material/CircularProgress";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [priceRange, setPriceRange] = useState([null, null]); // Default empty
  const [key, setKey] = useState(0);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch all products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  // Fetch all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/category/get-category`
      );

      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // get filter product
  const filterProduct = async () => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/product/product-filter`,
        { checked, radio, priceRange }
      );
      setProducts(data?.product);
      console.log(data?.product);
    } catch (error) {
      console.log(error);
    }
  };

  //get total count
  const getTotal = async (req, res) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/product/product-count`
      );

      setTotal(data?.total);
      console.log(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    LoadMore();
  }, [page]);
  //load more
  const LoadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  // Handle category filter
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  useEffect(() => {
    if (!checked.length && !radio.length) {
      getAllProducts();
    }
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  // Handle custom price range change
  const handlePriceChange = (value, index) => {
    const newPriceRange = [...priceRange];
    newPriceRange[index] = value;
    setPriceRange(newPriceRange);
  };

  // Apply filter with custom price range
  const applyPriceFilter = () => {
    const min =
      priceRange[0] !== null && priceRange[0] !== "" ? priceRange[0] : 0;
    const max =
      priceRange[1] !== null && priceRange[1] !== "" ? priceRange[1] : 100000;

    setRadio([]);
    setPriceRange([min, max]);
    filterProduct();
  };

  // Function to clear all filters
  const clearFilters = () => {
    setChecked([]); // Clear category filters
    setRadio([]); // Clear radio price filter
    setPriceRange([null, null]); // Reset custom price range
    setKey((prev) => prev + 1); // Force checkbox re-render
    getAllProducts(); // Fetch all products again
  };

  const exitingItemInCartCheck = (p) => {
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
      console.log("Item added to cart:", newItem);
    }

    toast.success("Item Added to cart");
  };


  return (
    <Layout title="Home - Ecommerce App">
      <div className="container flex flex-col">
        <div className="flex gap-4">
          {/* Sidebar */}
          <div className="w-1/5 p-4 bg-gray-100">
            <div className="flex flex-col gap-2">
              <Button type="default" className="mt-2" onClick={clearFilters}>
                Clear All Filters
              </Button>

              {/* Category Filter */}
              <div className="border border-white rounded-md p-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Category
                </h3>
                <div className="flex flex-col gap-1 mt-3">
                  {categories?.map((c) => (
                    <Checkbox
                      key={`${c._id}-${key}`}
                      checked={checked.includes(c._id)}
                      onChange={(e) => handleFilter(e.target.checked, c._id)}
                      className="!text-gray-500 font-semibold"
                    >
                      {c.name}
                    </Checkbox>
                  ))}
                </div>
              </div>
              {/* Price Filter */}
              <div className="border border-white rounded-md p-4">
                <h3 className="text-lg font-semibold text-gray-700">Price</h3>
                <div className="flex flex-col gap-2">
                  <Radio.Group
                    key={key}
                    value={radio}
                    onChange={(e) => setRadio(e.target.value)}
                    className="!flex flex-col gap-1 !mt-3"
                  >
                    {Price.map((p) => (
                      <div key={p._id}>
                        <Radio
                          value={p.array}
                          className="!text-gray-500 font-semibold"
                        >
                          {p.name}
                        </Radio>
                      </div>
                    ))}
                  </Radio.Group>

                  {/* Custom Price Range */}
                  <div className="flex items-center gap-2">
                    <InputNumber
                      min={0}
                      value={priceRange[0]}
                      onChange={(value) => handlePriceChange(value, 0)}
                      placeholder="Min"
                    />
                    <span className="text-gray-700">-</span>
                    <InputNumber
                      min={0}
                      value={priceRange[1]}
                      onChange={(value) => handlePriceChange(value, 1)}
                      placeholder="Max"
                    />
                  </div>
                  <Button
                    type="primary"
                    className="mt-2"
                    onClick={applyPriceFilter}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="w-4/5 flex flex-col py-4 pr-2 ">
            <div className="flex flex-col pb-4 gap-6">
              <h3 className="text-2xl font-semibold text-gray-800">Products</h3>
              <div className="flex flex-wrap gap-4 justify-stretch ">
                {products?.map((p) => (
                  <div
                    className="w-[23%] h-fit flex flex-col relative overflow-hidden rounded-lg hover:shadow-lg bg-white p-2 border border-gray-200 transition-transform duration-300 hover:scale-[1.02]"
                    key={p._id}
                  >
                    <div className="w-full h-[200px]">
                      <img
                        src={`${
                          import.meta.env.VITE_API_URL
                        }/api/v1/product/product-photo/${p._id}`}
                        alt={p.name}
                        className="w-full h-full object-contain p-2"
                      />
                      {p.discount > 0 && (
                        <span className="absolute h-10 flex items-end right-0 top-0 transform -translate-y-1/2 bg-cyan-500 text-white px-3 py-1 text-[10px] font-medium rounded-bl-lg">
                          {p.discount}% OFF
                        </span>
                      )}
                    </div>
                    <div className="relative w-[95%] overflow-hidden">
                      <h5 className="animate-marquee pt-2 text-md font-bold tracking-tight text-gray-600  whitespace-nowrap transition-transform duration-500 ease-in-out group-hover:-translate-x-1/2">
                        {p.name}
                      </h5>
                    </div>
                    <div className="w-full">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {p.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <h3 className="text-md font-semibold text-gray-800">
                          ₹ {Math.round(p.discountPrice)}
                        </h3>
                        <h3 className="text-sm font-semibold text-gray-400 line-through">
                          {p.discount ? ` ₹ ${p.price}` : ""}
                        </h3>
                      </div>
                      <div className="flex flex-col gap-2 px-1">
                        <Button
                          className="py-1 mt-2 text-[12px] text-blue-700 font-medium h-8"
                          onClick={() => navigate(`/product/${p.slug}`)}
                        >
                          More Details
                        </Button>
                        <Button
                          type="primary"
                          onClick={() => exitingItemInCartCheck(p)}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mx-auto mt-2 p-3">
              {products &&
                products.length < total &&
                (loading ? (
                  <CircularProgress className="w-8 h-8" />
                ) : (
                  <button
                    className="bg-blue-100 text-gray-600 px-4 py-2 rounded-md hover:bg-blue-200 hover:text-gray-50"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(page + 1);
                    }}
                  >
                    <FaAnglesDown />
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
