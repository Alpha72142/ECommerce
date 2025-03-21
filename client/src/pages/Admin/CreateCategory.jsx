import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import CategoryForm from "../../components/Form/CategoryForm";
import { Modal } from "antd";
import CircularProgress from "@mui/material/CircularProgress";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [editedPhoto, setEditedPhoto] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch categories
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
      toast.error("Error fetching categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // Handle new category creation
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const categoryData = new FormData();
      categoryData.append("name", name);
      if (photo) {
        categoryData.append("photo", photo);
      }

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/category/create-category`,
        categoryData
      );

      if (data.success) {
        toast.success(`${name} added`);
        setName("");
        setPhoto(null); // Reset photo state
        getAllCategory();
      } else {
        toast.error(data.message);
        console.log(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error adding category");
    }
  };

  // Handle edit mode
  const handleEdit = (category) => {
    setEditingId(category._id);
    setEditedName(category.name);
    setEditedPhoto(null);
  };

  // Handle save
  const handleSave = async (id) => {
    try {
      const formData = new FormData();
      formData.append("name", editedName);
      if (editedPhoto) {
        formData.append("photo", editedPhoto);
      }

      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/category/update-category/${id}`,
        formData
      );

      if (data.success) {
        toast.success("Category updated successfully");

        setEditingId(null); // Exit edit mode
        setEditedPhoto(null); // Reset image state

        await getAllCategory(); // ✅ Re-fetch updated categories to reflect changes
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating category");
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setEditingId(null);
    setEditedName("");
  };

  // Filter categories based on search input
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  const showModel = (id) => {
    setDeleteId(id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!deleteId) return;

    try {
      const { data } = await axios.delete(
        `${
          import.meta.env.VITE_API_URL
        }/api/v1/category/delete-category/${deleteId}`
      );

      if (data.success) {
        toast.success("Category deleted successfully");
        getAllCategory(); // Refresh the list
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting category");
    }

    setIsModalOpen(false); // Close the modal
    setDeleteId(null);
  };

  return (
    <Layout title="Dashboard - Manage Category">
      <div className="container p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <AdminMenu />
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4">
            <div className="bg-white p-6 mt-2 rounded-lg shadow-lg">
              {/* Header with Search Box */}
              <div className="flex flex-col md:flex-row justify-between items-center pb-4 mb-4 gap-2">
                <h3 className="text-2xl md:text-3xl font-semibold text-gray-800">
                  Manage Categories
                </h3>
                <input
                  type="text"
                  placeholder="Search categories..."
                  className="p-2 rounded-lg w-full md:w-64 border border-gray-200 outline-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Category Form */}
              <CategoryForm
                handleSubmit={handleSubmit}
                value={name}
                setValue={setName}
                setPhoto={setPhoto}
                photo={photo}
              />

              {/* Table */}
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <CircularProgress />
                  </div>
                ) : (
                  <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead>
                      <tr className="text-gray-800 border-b">
                        <th className="p-3 text-left w-1/4">Img</th>
                        <th className="p-3 text-left w-2/4">Name</th>
                        <th className="p-3 text-left w-1/4">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredCategories.length > 0 ? (
                        filteredCategories.map((category) => {
                          return (
                            <tr
                              key={category._id}
                              className="hover:bg-gray-100 transition duration-200"
                            >
                              {/* Image Column */}
                              <td className="text-gray-800 font-medium w-3/4 md:w-1/4">
                                {editingId === category._id ? (
                                  <>
                                    {/* File Upload Button */}
                                    <label className="w-full h-10 cursor-pointer flex items-center justify-center bg-gray-50 text-blue-500 border border-gray-300 rounded-sm overflow-hidden relative hover:bg-gray-200">
                                      {editedPhoto ? (
                                        // Show new image preview if uploaded
                                        <img
                                          src={URL.createObjectURL(editedPhoto)}
                                          alt="category_image"
                                          className="absolute w-full h-full object-contain"
                                        />
                                      ) : category.photo ? (
                                        // Show existing category image if no new image selected
                                        <img
                                          src={`${
                                            import.meta.env.VITE_API_URL
                                          }/api/v1/category/category-photo/${
                                            category._id
                                          }?t=${Date.now()}`}
                                          alt="category_image"
                                          className="object-contain rounded-sm w-12 h-12 md:w-16 md:h-16"
                                        />
                                      ) : (
                                        <span className="text-xs text-gray-500">
                                          Upload
                                        </span>
                                      )}
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                          setEditedPhoto(e.target.files[0])
                                        }
                                        hidden
                                      />
                                    </label>
                                  </>
                                ) : (
                                  <img
                                    src={`${
                                      import.meta.env.VITE_API_URL
                                    }/api/v1/category/category-photo/${
                                      category._id
                                    }?t=${Date.now()}`}
                                    alt="category_image"
                                    className="object-contain w-12 md:w-16 rounded-sm"
                                  />
                                )}
                              </td>
                              {/* Name Column */}
                              <td className="p-3 text-gray-800 font-medium w-2/4">
                                {editingId === category._id ? (
                                  <input
                                    type="text"
                                    className="p-2 border border-gray-300 rounded w-full"
                                    value={editedName}
                                    onChange={(e) =>
                                      setEditedName(e.target.value)
                                    }
                                  />
                                ) : (
                                  <span>{category.name}</span>
                                )}
                              </td>

                              {/* Action Buttons */}
                              <td className="p-3 w-full md:w-1/4 flex gap-3">
                                {editingId === category._id ? (
                                  <>
                                    {/* Save Button */}
                                    <button
                                      onClick={() => handleSave(category._id)}
                                      className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition duration-200"
                                    >
                                      <FaCheck />
                                    </button>

                                    {/* Cancel Button */}
                                    <button
                                      onClick={handleCancel}
                                      className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-600 transition duration-200"
                                    >
                                      <FaTimes />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    {/* Edit Button */}
                                    <button
                                      onClick={() => handleEdit(category)}
                                      className="bg-blue-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition duration-200"
                                    >
                                      <FaEdit />
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                      onClick={() => showModel(category._id)}
                                      className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition duration-200"
                                    >
                                      <FaTrash />
                                    </button>
                                  </>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan="3"
                            className="p-3 text-center text-gray-500"
                          >
                            No categories found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
                <Modal
                  title="Confirm Delete"
                  open={isModalOpen}
                  onOk={handleDelete} // Calls API when OK is clicked
                  onCancel={() => setIsModalOpen(false)} // Closes the modal
                  okText="Delete"
                  cancelText="Cancel"
                  okButtonProps={{ danger: true }}
                >
                  <p>Are you sure you want to delete this category?</p>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
