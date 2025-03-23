import { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { Checkbox, InputNumber, Button, Radio } from "antd";
import { Price } from "../components/Price";
import { Link, useNavigate } from "react-router-dom";
import { FaAnglesDown } from "react-icons/fa6";
import CircularProgress from "@mui/material/CircularProgress";
import { FaFilter } from "react-icons/fa";
import useCartAction from "../components/hooks/useCartAction";
const HomePage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCartAction();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [priceRange, setPriceRange] = useState([null, null]); // Default empty
  const [key, setKey] = useState(0);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [showFilter, setShowFilter] = useState(false);
  const menuRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch all products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${API_URL}/api/v1/product/product-list/${page}`
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
        `${API_URL}/api/v1/category/get-category`
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
        `${API_URL}/api/v1/product/product-filter`,
        { checked, radio, priceRange }
      );
      setProducts(data?.product);
    } catch (error) {
      console.log(error);
    }
  };

  //get total count
  const getTotal = async (req, res) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/v1/product/product-count`
      );

      setTotal(data?.total);
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
        `${API_URL}/api/v1/product/product-list/${page}`
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
    setShowFilter(false);
  };

  // Function to clear all filters
  const clearFilters = () => {
    setChecked([]); // Clear category filters
    setRadio([]); // Clear radio price filter
    setPriceRange([null, null]); // Reset custom price range
    setKey((prev) => prev + 1); // Force checkbox re-render
    getAllProducts(); // Fetch all products again
    setShowFilter(false);
  };

  const closeMenu = () => {
    setShowFilter(false);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <Layout title="Home - Ecommerce App">
      <div className="container flex flex-col">
        <div className="flex gap-4 relative">
          {/* Sidebar */}
          <div className="w-1/5 p-4 bg-gray-100 hidden lg:block">
            <div className="flex flex-col gap-2">
              <FilterComponent
                categories={categories}
                checked={checked}
                handleFilter={handleFilter}
                radio={radio}
                setRadio={setRadio}
                Price={Price}
                priceRange={priceRange}
                handlePriceChange={handlePriceChange}
                applyPriceFilter={applyPriceFilter}
                clearFilters={clearFilters}
              />
            </div>
          </div>

          {/*Hidden filter for mobile */}
          <div
            ref={menuRef}
            className={`absolute overflow-y-scroll top-0 left-0 h-full w-[75%] md:w-1/3 bg-white shadow-lg transform ${
              showFilter ? "translate-x-0" : "-translate-x-full"
            } transition-transform lg:hidden z-50`}
          >
            <div className="flex flex-col gap-2 mx-3">
              <FilterComponent
                categories={categories}
                checked={checked}
                handleFilter={handleFilter}
                radio={radio}
                setRadio={setRadio}
                Price={Price}
                priceRange={priceRange}
                handlePriceChange={handlePriceChange}
                applyPriceFilter={applyPriceFilter}
                clearFilters={clearFilters}
              />
            </div>
          </div>

          {/* Products Section */}
          <div className="w-full lg:w-4/5 flex flex-col py-4 mx-6">
            <div className="flex flex-col pb-4 gap-6 ">
              <h3 className="text-xl md:text-2xl font-semibold text-gray-800">
                Products
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFilter(!showFilter);
                }}
                className="w-6 cursor-pointer rounded-l-full h-8 bg-green-500 fixed top-35 right-0 z-1 flex justify-center items-center pl-1 text-sm text-white lg:hidden"
              >
                <FaFilter />
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products?.map((p) => (
                  <div
                    className="w-full h-fit flex flex-col relative overflow-hidden rounded-lg hover:shadow-lg bg-white p-2 border border-gray-200 transition-transform duration-300 hover:scale-[1.02]"
                    key={p._id}
                  >
                    <div className="relative w-full h-[200px] p-2">
                      <img
                        src={`${API_URL}/api/v1/product/product-photo/${p._id}`}
                        alt={p.name}
                        className="w-full h-full object-contain p-2"
                      />
                      {p.discount > 0 && (
                        <span className="absolute top-0 right-0 bg-cyan-500 text-white text-xs font-semibold px-2 py-1 rounded-bl-lg">
                          {p.discount}% OFF
                        </span>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="p-1">
                      <h5 className="text-md font-bold text-gray-600 truncate">
                        {p.name}
                      </h5>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {p.description}
                      </p>

                      {/* Pricing */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-lg font-bold text-gray-700">
                          ₹ {Math.round(p.discountPrice)}
                        </span>
                        {p.discount > 0 && (
                          <span className="text-sm text-gray-400 line-through">
                            ₹ {p.price}
                          </span>
                        )}
                      </div>

                      {/* Buttons */}
                      <div className="flex flex-col gap-2">
                        <Button
                          className="py-1 mt-2 text-xs md:text-[12px] text-blue-700 font-medium h-8"
                          onClick={() => navigate(`/product/${p.slug}`)}
                        >
                          More Details
                        </Button>
                        <Button type="primary" onClick={() => addToCart(p)}>
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
                  <CircularProgress className="w-6 h-6 sm:w-8 sm:h-8" />
                ) : (
                  <button
                    className="bg-blue-100 text-gray-600 px-3 sm:px-4 py-2 rounded-md hover:bg-blue-200 hover:text-gray-50"
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

const FilterComponent = ({
  categories,
  checked,
  handleFilter,
  radio,
  setRadio,
  Price,
  priceRange,
  handlePriceChange,
  applyPriceFilter,
  clearFilters,
}) => (
  <>
    <Button type="default" className="mt-2" onClick={clearFilters}>
      Clear All Filters
    </Button>

    {/* Category Filter */}
    <div className="border border-white rounded-md p-4 ">
      <h3 className="text-lg font-semibold text-gray-700">Category</h3>
      <div className="flex flex-col gap-1 mt-3">
        {categories?.map((c, i) => (
          <Checkbox
            key={`${c._id}-${i}`}
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
          value={radio}
          onChange={(e) => setRadio(e.target.value)}
          className="!flex flex-col gap-1 !mt-3"
        >
          {Price.map((p) => (
            <div key={p._id}>
              <Radio value={p.array} className="!text-gray-500 font-semibold">
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
        <Button type="primary" className="mt-2" onClick={applyPriceFilter}>
          Apply Filters
        </Button>
      </div>
    </div>
  </>
);

export default HomePage;
