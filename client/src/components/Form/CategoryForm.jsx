import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

const CategoryForm = ({ handleSubmit, value, setValue }) => {
  return (
    <>
      <form onSubmit={handleSubmit} className="flex gap-4 items-center">
        <input
          type="text"
          placeholder="Enter new category"
          className="p-2 rounded-lg w-64 bg-gray-50 border border-gray-200 outline-none"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Add New
          <FaPlus />
        </button>
      </form>
    </>
  );
};

export default CategoryForm;
