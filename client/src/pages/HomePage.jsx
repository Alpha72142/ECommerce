import { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { Checkbox, InputNumber, Button, Radio } from "antd";
import { Price } from "../components/Price";
import { Link, useNavigate } from "react-router-dom";
import { FaAnglesDown } from "react-icons/fa6";

const HomePage = () => {
  const navigate = useNavigate();
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
                      <p className="text-sm text-gray-600">
                        {p.description.substring(0, 24)}...
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
              {products && products.length < total && (
                <button
                  className="bg-blue-100 text-gray-600 px-4 py-2 rounded-md hover:bg-blue-200 hover:text-gray-50"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(page + 1);
                  }}
                >
                  {loading ? (
                    <svg
                      aria-hidden="true"
                      className="w-6 h-6 text-white animate-spin fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  ) : (
                    <FaAnglesDown />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
