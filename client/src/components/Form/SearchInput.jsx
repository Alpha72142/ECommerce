import { useNavigate } from "react-router-dom";
import { useSearch } from "../../context/search";
import axios from "axios";

const SearchInput = ({className}) => {
  const [values, setValues] = useSearch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/product/search/${
          values.keyword
        }`
      );
      setValues({ ...values, results: data });
      navigate("/search");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form
        className={`flex items-center max-w- mx-auto ${className}`}
        onSubmit={handleSubmit}
      >
        <label htmlFor="simple-search" className="sr-only">
          Search
        </label>
        <div className="relative w-full flex">
          <input
            type="text"
            id="simple-search"
            className="bg-gray-50 border border-r-0 border-gray-300 text-gray-900 text-sm rounded-l-lg focus:ring-gray-300  block w-full p-2.5 outline-none"
            placeholder="Search"
            onChange={(e) => setValues({ ...values, keyword: e.target.value })}
            required
          />
          <button
            type="submit"
            className="p-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-r-lg border border-l-0 border-gray-300 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-50 "
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <span className="sr-only">Search</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchInput;
