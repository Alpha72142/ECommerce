import { useState, createContext, useContext } from "react";
import PropTypes from "prop-types";

const SearchContext = createContext();

const SearchProvider = ({ children }) => {
  const [search, setSearch] = useState({
    keyword:"",
    results:[],
  });



  return (
    <SearchContext.Provider value={[search, setSearch]}>
      {children}
    </SearchContext.Provider>
  );
};

SearchProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

//custom hook
const useSearch = () => useContext(SearchContext);

// eslint-disable-next-line
export { useSearch, SearchProvider };
