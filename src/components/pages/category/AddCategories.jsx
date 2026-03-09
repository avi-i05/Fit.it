import { useEffect, useState } from "react";
import Sidebar from "../../sidebar/Sidebar";

const AddCategory = () => {
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    categoryName: "",
    parentCategory: ""
  });

  // ================= FETCH CATEGORIES =================
  const fetchCategories = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/categories/get/all`,
        {
          credentials: "include"
        }
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
  const loadCategories = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/categories/get/all`,
        {
          credentials: "include"
        }
      );

      const result = await res.json();

      if (result.success) {
        setCategories(result.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  loadCategories();
}, []);

  // ================= BUILD TREE =================
  const buildTree = (list) => {
    const map = {};
    const roots = [];

    list.forEach((cat) => {
      map[cat._id] = { ...cat, children: [] };
    });

    list.forEach((cat) => {
      if (cat.parentCategory) {
        map[cat.parentCategory]?.children.push(map[cat._id]);
      } else {
        roots.push(map[cat._id]);
      }
    });

    return roots;
  };

  const treeData = buildTree(categories);

  // ================= RENDER OPTIONS =================
  const renderOptions = (cats, level = 0) =>
    cats.flatMap((cat) => [
      <option key={cat._id} value={cat._id}>
        {"—".repeat(level)} {cat.categoryName}
      </option>,
      ...(cat.children?.length
        ? renderOptions(cat.children, level + 1)
        : [])
    ]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ================= CREATE CATEGORY =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/categories/create/with/subcategories`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      const result = await res.json();

      if (result.success) {
        alert("Category created successfully");

        setFormData({
          categoryName: "",
          parentCategory: ""
        });

        fetchCategories(); // refresh categories
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-[260px] px-8 py-10">
        <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow">

          <h1 className="text-2xl font-semibold mb-6">
            Add Category
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Category Name */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                Category Name
              </label>

              <input
                type="text"
                name="categoryName"
                value={formData.categoryName}
                onChange={handleChange}
                placeholder="Enter category name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                required
              />
            </div>

            {/* Parent Category */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                Parent Category
              </label>

              <select
                name="parentCategory"
                value={formData.parentCategory}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              >
                <option value="">None (Main Category)</option>

                {renderOptions(treeData)}

              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800"
            >
              Create Category
            </button>

          </form>

        </div>
      </div>
    </div>
  );
};

export default AddCategory;