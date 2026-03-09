import { useEffect, useState } from "react";
import Sidebar from "../../sidebar/Sidebar.jsx";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Folder } from "lucide-react";

const AllCategories = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // FETCH
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
    fetchCategories();
  }, []);

  // DELETE
  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;

    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/categories/${id}`,
        { 
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        }
      );

      fetchCategories();
    } catch (err) {
      console.log(err);
    }
  };

  // BUILD TREE
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

  // RENDER TREE
  const renderTree = (cats, level = 0) => {
    return cats.map((cat) => (
      <div key={cat._id} className="relative">

        {/* vertical hierarchy line */}
        {level > 0 && (
          <div
            className="absolute left-0 top-0 bottom-0 border-l border-gray-300"
            style={{ marginLeft: `${level * 28 - 14}px` }}
          />
        )}

        <div
          style={{ marginLeft: `${level * 28}px` }}
          className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-5 py-3 mb-3 shadow-sm hover:shadow-md transition"
        >

          {/* Category */}
          <div className="flex items-center gap-3">

            <Folder size={18} className="text-gray-500" />

            <span className="text-gray-800 font-medium">
              {cat.categoryName}
            </span>

          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">

            <button
              onClick={() => navigate(`/categories/edit/${cat._id}`)}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
            >
              <Pencil size={16} />
              Edit
            </button>

            <button
              onClick={() => handleDelete(cat._id)}
              className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
            >
              <Trash2 size={16} />
              Delete
            </button>

          </div>

        </div>

        {cat.children.length > 0 && renderTree(cat.children, level + 1)}

      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">

      <Sidebar />

      <div className="flex-1 ml-[260px] px-8 py-10">

        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="flex justify-between items-center mb-8">

            <h1 className="text-2xl font-semibold text-gray-800">
              Category Management
            </h1>

            <button
              onClick={() => navigate("/categories/add")}
              className="bg-[#f87171] text-white px-5 py-2 rounded-lg hover:opacity-90 transition"
            >
              + Add Category
            </button>

          </div>

          {/* List */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">

            {treeData.length === 0 ? (
              <p className="text-gray-500">No categories found</p>
            ) : (
              renderTree(treeData)
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default AllCategories;