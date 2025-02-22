import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import CategoryForm from "../../components/Form/CategoryForm";
import { Modal } from "antd";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

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
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // Handle new category creation
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/category/create-category`,
        { name }
      );
      if (data.success) {
        toast.success(`${name} added`);
        setName("");
        getAllCategory();
      } else {
        toast.error(data.message);
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
  };

  // Handle save
  const handleSave = async (id) => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/category/update-category/${id}`,
        { name: editedName }
      );
      if (data.success) {
        toast.success("Category updated successfully");
        setEditingId(null); // Exit edit mode
        getAllCategory();
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
      <div className="container">
        <div className="flex gap-4">
          {/* Sidebar */}
          <div className="w-1/4">
            <AdminMenu />
          </div>

          {/* Main Content */}
          <div className="w-3/4">
            <div className="bg-white p-6 mt-2 rounded-lg shadow-lg">
              {/* Header with Search Box */}
              <div className="flex justify-between items-center pb-4 mb-4">
                <h3 className="text-3xl font-semibold text-gray-800">
                  Manage Categories
                </h3>
                <input
                  type="text"
                  placeholder="Search categories..."
                  className="p-2 rounded-lg w-64 border border-gray-200 outline-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Category Form */}
              <CategoryForm
                handleSubmit={handleSubmit}
                value={name}
                setValue={setName}
              />

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                  <thead>
                    <tr className="text-gray-800 border-b">
                      <th className="p-3 text-left w-3/4">Name</th>
                      <th className="p-3 text-left w-1/4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategories.length > 0 ? (
                      filteredCategories.map((category) => (
                        <tr
                          key={category._id}
                          className="hover:bg-gray-100 transition duration-200"
                        >
                          <td className="p-3 text-gray-800 font-medium w-3/4">
                            {editingId === category._id ? (
                              <input
                                type="text"
                                className="p-2 border border-b-gray-300 border-x-0 border-t-0 outline-none w-full"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                              />
                            ) : (
                              category.name
                            )}
                          </td>
                          <td className="p-3 w-1/4 flex gap-3">
                            {editingId === category._id ? (
                              <>
                                <button
                                  onClick={() => handleSave(category._id)}
                                  className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition duration-200"
                                >
                                  <FaCheck />
                                </button>
                                <button
                                  onClick={handleCancel}
                                  className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-600 transition duration-200"
                                >
                                  <FaTimes />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleEdit(category)}
                                  className="bg-blue-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition duration-200"
                                >
                                  <FaEdit />
                                </button>
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
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="2"
                          className="p-3 text-center text-gray-500"
                        >
                          No categories found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
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
