import React from "react";
import Layout from "../components/Layout/Layout";
import useCategory from "../components/hooks/useCategory";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

const Categories = () => {
  const categories = useCategory();
  const API_URL = import.meta.env.VITE_API_URL;

  return (
    <Layout>
      {categories && categories.length > 0 ? (
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-center gap-6">
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/category/${category.slug}`}
                className="relative w-[150px] md:w-[200px] lg:w-[250px] h-[120px] md:h-[150px] lg:h-[180px] 
                         rounded-lg overflow-hidden shadow-md transition-transform duration-300 
                         hover:shadow-xl hover:scale-105"
              >
                {/* Category Image */}
                <img
                  src={`${API_URL}/api/v1/category/category-photo/${
                    category._id
                  }?t=${Date.now()}`}
                  alt={category.name}
                  className="w-full h-full object-cover rounded-lg"
                />

                {/* Overlapping Category Name */}
                <p
                  className="absolute bottom-0 left-0 w-full bg-cyan-500 bg-opacity-50 text-white text-center 
                            text-sm md:text-base font-medium py-1 md:py-2"
                >
                  {category.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-[50vh]">
          <CircularProgress className="w-12 h-12 text-white" />
        </div>
      )}
    </Layout>
  );
};

export default Categories;
