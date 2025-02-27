import React from "react";
import { BiSolidImageAdd } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";

const CategoryForm = ({ handleSubmit, value, setValue, setPhoto, photo }) => {
  return (
    <form onSubmit={handleSubmit} className="flex gap-4 items-center">
      {/* File Upload + Preview (Compact) */}
      <label className="w-10 h-10 cursor-pointer flex items-center justify-center bg-gray-50 text-blue-500 border border-gray-300 rounded-sm overflow-hidden relative hover:bg-gray-200">
        {photo ? (
          <img
            src={URL.createObjectURL(photo)}
            alt="category_image"
            className="absolute w-full h-full object-fill"
          />
        ) : (
          <BiSolidImageAdd className="w-4 h-4" />
        )}
        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
          hidden
        />
      </label>

      {/* Category Name Input */}
      <input
        type="text"
        placeholder="Enter category"
        className="p-2 rounded-lg bg-gray-50 border border-gray-200 outline-none w-60"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-blue-600 flex items-center gap-2 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
      >
       <FaPlus/> CREATE CATEGORY
      </button>
    </form>
  );
};

export default CategoryForm;
