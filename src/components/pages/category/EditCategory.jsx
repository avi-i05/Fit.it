import { useEffect, useState } from "react";
import Sidebar from "../../sidebar/Sidebar.jsx";
import { useNavigate, useParams } from "react-router-dom";

const EditCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [parentCategory, setParentCategory] = useState("");

  // ================= FETCH CATEGORY =================
  const fetchCategory = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/categories/${id}`
      );

      const result = await res.json();

      if (result.success) {
        setCategoryName(result.data.categoryName);
        setParentCategory(result.data.parentCategory || "");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ================= FETCH ALL CATEGORIES =================
  const fetchCategories = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/categories/get/all`
      );

      const result = await res.json();

      if (result.success) {
        setCategories(result.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCategory();
    fetchCategories();
  }, []);

  // ================= UPDATE CATEGORY =================
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/categories/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            categoryName,
            parentCategory,
          }),
        }
      );

      const result = await res.json();

      if (result.success) {
        alert("Category updated successfully");
        navigate("/categories");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />

      <div className="flex-1 ml-[260px] px-8 py-10">
        <div className="max-w-xl mx-auto">

          {/* Title */}
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Edit Category
          </h1>

          {/* Form */}
          <form
            onSubmit={handleUpdate}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5"
          >

            {/* Category Name */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Category Name
              </label>

              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f87171]"
                placeholder="Enter category name"
                required
              />
            </div>

            {/* Parent Category */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Parent Category
              </label>

              <select
                value={parentCategory}
                onChange={(e) => setParentCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f87171]"
              >
                <option value="">None</option>

                {categories.map((cat) => (
                  cat._id !== id && (
                    <option key={cat._id} value={cat._id}>
                      {cat.categoryName}
                    </option>
                  )
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-3">

              <button
                type="submit"
                className="bg-[#f87171] text-white px-5 py-2 rounded-lg hover:opacity-90"
              >
                Update Category
              </button>

              <button
                type="button"
                onClick={() => navigate("/categories")}
                className="bg-gray-200 px-5 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCategory;