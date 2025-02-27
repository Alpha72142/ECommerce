import { useEffect, useState, useRef } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { GrUpdate } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import { BiSolidImageAdd } from "react-icons/bi";
import { Modal, Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";

const UpdateProduct = () => {
 const navigate = useNavigate();
 const params = useParams();
 const [categories, setCategories] = useState([]);
 const [name, setName] = useState("");
 const [description, setDescription] = useState("");
 const [price, setPrice] = useState("");
 const [discount, setDiscount] = useState("");
 const [category, setCategory] = useState("");
 const [quantity, setQuantity] = useState("");
 const [shipping, setShipping] = useState(false);
 const [photo, setPhoto] = useState(null);
 const dropdownRef = useRef(null);
 const [isDropOpen, setIsDropOpen] = useState(false);
 const [isShippingDropdownOpen, setIsShippingDropdownOpen] = useState(false);
 const [id, setId] = useState("");
 const [isModalOpen, setIsModalOpen] = useState(false);

 const getSingleProduct = async () => {
   try {
     const { data } = await axios.get(
       `${import.meta.env.VITE_API_URL}/api/v1/product/get-single-product/${
         params.slug
       }`
     );
     if (data?.product) {
       setName(data.product.name);
       setCategory(data.product.category?._id || ""); // Store only _id
       setId(data.product._id);
       setDescription(data.product.description);
       setPrice(data.product.price);
       setQuantity(data.product.quantity);
       setDiscount(data.product.discount);
       setShipping(data.product.shipping);
     }
   } catch (error) {
     console.error(error);
     toast.error("Error fetching product details");
   }
 };

 const getAllCategory = async () => {
   try {
     const { data } = await axios.get(
       `${import.meta.env.VITE_API_URL}/api/v1/category/get-category`
     );
     if (data?.success) {
       setCategories(data.category);
     }
   } catch (error) {
     console.error(error);
     toast.error("Error fetching categories");
   }
 };

 useEffect(() => {
   getSingleProduct();
   getAllCategory();
 }, [params.slug]); // Now updates when the product slug changes

 const handleUpdate = async (e) => {
   e.preventDefault();
   try {
     const productData = new FormData();
     productData.append("name", name);
     productData.append("description", description);
     productData.append("price", price);
     productData.append("discount", discount);
     productData.append("discountPrice", price - (price * discount) / 100);
     productData.append("quantity", quantity);
     productData.append("shipping", shipping ? "true" : "false");
     if (photo) productData.append("photo", photo);
     productData.append("category", category);

     const { data } = await axios.put(
       `${import.meta.env.VITE_API_URL}/api/v1/product/update-product/${id}`,
       productData
     );

     if (data?.success) {
       toast.success("Product Updated Successfully");
       navigate("/dashboard/admin/products");
     } else {
       toast.error(data?.message);
     }
   } catch (error) {
     console.error(error);
     toast.error("Something went wrong while updating the product");
   }
 };

 const deleteProduct = async () => {
   try {
     await axios.delete(
       `${import.meta.env.VITE_API_URL}/api/v1/product/delete-product/${id}`
     );
     toast.success("Product deleted successfully");
     navigate("/dashboard/admin/products");
     setIsModalOpen(false);
   } catch (error) {
     console.error(error);
     toast.error("Something went wrong while deleting the product");
   }
 };

  return (
    <Layout title="Dashboard - Create Product">
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Sidebar */}
          <div className="hidden md:block md:w-1/4">
            <AdminMenu />
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4">
            <div className="mt-2 p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <h3 className="text-xl md:text-2xl text-gray-900 font-semibold">
                  Update Product
                </h3>

                <div
                  className="relative w-full md:w-64 mt-4 md:mt-0"
                  ref={dropdownRef}
                >
                  <Select
                    placeholder="Select a category"
                    size="large"
                    showSearch
                    className="w-full"
                    onChange={(value) => setCategory(value)}
                    value={category}
                    onDropdownVisibleChange={(open) => setIsDropOpen(open)}
                    suffixIcon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                          isDropOpen ? "rotate-180" : ""
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    }
                  >
                    {categories?.map((c) => (
                      <Select.Option key={c._id} value={c._id}>
                        {c.name}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              </div>

              {/* Image Upload */}
              <div className="flex flex-col md:flex-row gap-6 py-4">
                {photo ? (
                  <div className="w-full md:w-1/3 h-48 overflow-hidden border border-gray-300 rounded-lg">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="product_image"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-full md:w-1/3 h-48 overflow-hidden border border-gray-300 rounded-lg">
                    <img
                      src={`${
                        import.meta.env.VITE_API_URL
                      }/api/v1/product/product-photo/${id}`}
                      alt="product_image"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <label className="w-full md:w-40 h-32 cursor-pointer flex flex-col items-center justify-center bg-gray-50 text-blue-500 font-medium p-3 rounded-lg border border-gray-300 hover:bg-gray-200">
                  <BiSolidImageAdd className="text-blue-500 w-10 h-10" />
                  {photo ? photo.name : "Upload Image"}
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    hidden
                  />
                </label>
              </div>

              {/* Inputs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  value={name}
                  placeholder="Product Name"
                  className="w-full h-12 bg-gray-50 border outline-none border-gray-300 rounded-lg p-3"
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="number"
                  value={price}
                  placeholder="Product Price"
                  className="w-full h-12 bg-gray-50 border outline-none border-gray-300 rounded-lg p-3"
                  onChange={(e) => setPrice(e.target.value)}
                />
                <input
                  type="number"
                  value={quantity}
                  placeholder="Product Quantity"
                  className="w-full h-12 bg-gray-50 border outline-none border-gray-300 rounded-lg p-3"
                  onChange={(e) => setQuantity(e.target.value)}
                />

                <input
                  type="number"
                  value={discount}
                  placeholder="Product Discount (Optional)"
                  className="w-full h-12 bg-gray-50 border outline-none border-gray-300 rounded-lg p-3"
                  onChange={(e) => {
                    let value = parseInt(e.target.value, 10);
                    if (value > 100) value = 100; // Prevent values above 100
                    if (value < 0 || isNaN(value)) value = 0; // Prevent negative values
                    setDiscount(value);
                  }}
                  min="0"
                  max="100"
                />
              </div>

              {/* Description */}
              <textarea
                value={description}
                placeholder="Product Description"
                className="w-full h-24 bg-gray-50 border outline-none border-gray-300 rounded-lg p-3 resize-none mt-4"
                onChange={(e) => setDescription(e.target.value)}
              />

              {/* Shipping & Submit */}
              <div className="flex flex-col md:flex-row justify-between items-center mt-4">
                <Select
                  placeholder="Product Shipping"
                  size="large"
                  showSearch
                  className="w-full md:w-1/3 bg-gray-50 border border-gray-300 rounded-lg"
                  onChange={(value) => setShipping(value)}
                  value={shipping ? "yes" : "no"}
                  onDropdownVisibleChange={(open) =>
                    setIsShippingDropdownOpen(open)
                  }
                  suffixIcon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                        isShippingDropdownOpen ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  }
                >
                  <Select.Option value="0">No</Select.Option>
                  <Select.Option value="1">Yes</Select.Option>
                </Select>
                <div className="flex gap-5">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg flex items-center gap-2 mt-4 md:mt-0"
                    onClick={handleUpdate}
                  >
                    <GrUpdate className="w-4 h-4" />
                    UPDATE
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-lg flex items-center gap-2 mt-4 md:mt-0"
                    onClick={() => showModel()}
                  >
                    <MdDelete className="w-5 h-5" />
                    DELETE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal
          title="Confirm Delete"
          open={isModalOpen}
          onOk={deleteProduct} // Calls API when OK is clicked
          onCancel={() => setIsModalOpen(false)} // Closes the modal
          okText="Delete"
          cancelText="Cancel"
          okButtonProps={{ danger: true }}
        >
          <p>Are you sure you want to delete this product?</p>
        </Modal>
      </div>
    </Layout>
  );
};

export default UpdateProduct;
