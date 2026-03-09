import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../dashboard/Sidebar";
import { getProduct, updateProduct } from "../../../../api/product";
import api from "../../../../api/axios";

const dropdownClass =
  "w-full appearance-none bg-black border border-white/10 p-3 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20";

const Dropdown = ({ value, onChange, children }) => {
  return (
    <div className="relative">
      <select value={value} onChange={onChange} className={dropdownClass}>
        {children}
      </select>

      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/70">
        ▼
      </div>
    </div>
  );
};


const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [categories, setCategories] = useState([]);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [expanded, setExpanded] = useState({});

  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    productCategory: "",
    highlights: [],
    variants: [],
  });

  /* ================= FETCH PRODUCT ================= */

  const fetchProduct = async () => {
    try {
      const { data } = await getProduct(productId);

      const product = data?.data?.product;
      const variants = data?.data?.variants || [];

      setFormData({
        productName: product?.productName || "",
        description: product?.description || "",
        productCategory: product?.productCategory || "",
        highlights: product?.highlights || [],
        variants: variants,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH CATEGORIES ================= */

  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/v1/categories/get/all");

      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, [productId]);

  /* ================= CATEGORY TREE ================= */

  const buildTree = (list) => {
    const map = {};
    const roots = [];

    list.forEach((cat) => {
      map[cat._id] = { ...cat, children: [] };
    });

    list.forEach((cat) => {
      if (cat.parentCategory) {
        const parent = map[cat.parentCategory];
        if (parent) parent.children.push(map[cat._id]);
      } else {
        roots.push(map[cat._id]);
      }
    });

    return roots;
  };

  const treeCategories = buildTree(categories);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderTree = (nodes, level = 0) => {
    return nodes.map((node) => (
      <div key={node._id}>
        <div
          className="flex items-center justify-between py-3 px-4 hover:bg-white/10 cursor-pointer border-b border-white/5"
          style={{ paddingLeft: `${16 + level * 16}px` }}
        >
          <span
            className={`flex-1 ${
              formData.productCategory === node._id ? "text-green-400" : ""
            }`}
            onClick={() => {
              setFormData((prev) => ({
                ...prev,
                productCategory: node._id,
              }));
              setCategoryOpen(false);
            }}
          >
            {node.categoryName}{" "}
          </span>

          {node.children?.length > 0 && (
            <button
              type="button"
              onClick={() => toggleExpand(node._id)}
              className="text-white/60 text-sm px-2"
            >
              {expanded[node._id] ? "−" : "+"}
            </button>
          )}
        </div>

        {expanded[node._id] &&
          node.children &&
          renderTree(node.children, level + 1)}
      </div>
    ));
  };

  /* ================= BASIC INPUT ================= */

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* ================= VARIANT FUNCTIONS ================= */

  const updateVariant = (index, field, value) => {
    const updated = formData.variants.map((v, i) =>
      i === index ? { ...v, [field]: value } : v
    );

    setFormData((prev) => ({
      ...prev,
      variants: updated,
    }));
  };

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          size: "",
          color: "",
          audience: "unisex",
          price: "",
          stock: "",
          images: [],
        },
      ],
    }));
  };

  const removeVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  /* ================= IMAGE HANDLING ================= */

  const handleVariantImage = (index, files) => {
    const updated = [...formData.variants];
    const newImages = Array.from(files);

    updated[index].images = [...(updated[index].images || []), ...newImages];

    setFormData((prev) => ({
      ...prev,
      variants: updated,
    }));
  };

  const removeVariantImage = (variantIndex, imageIndex) => {
    const updated = [...formData.variants];
    updated[variantIndex].images.splice(imageIndex, 1);

    setFormData((prev) => ({
      ...prev,
      variants: updated,
    }));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      const form = new FormData();

      form.append(
        "productData",
        JSON.stringify({
          productName: formData.productName,
          description: formData.description,
          productCategory: formData.productCategory,
          highlights: formData.highlights,
        })
      );

      form.append(
        "variants",
        JSON.stringify(
          formData.variants.map((v) => ({
            _id: v._id,
            size: v.size,
            color: v.color,
            audience: v.audience,
            price: v.price,
            stock: v.stock,
            existingImages: (v.images || []).filter(
              (img) => typeof img === "string"
            ),
          }))
        )
      );

      formData.variants.forEach((variant, index) => {
        variant.images?.forEach((img) => {
          if (img instanceof File) {
            form.append(`variantImages_${index}`, img);
          }
        });
      });

      await updateProduct(productId, form);

      alert("Product updated successfully ✅");

      navigate("/partner/products");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading product...{" "}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex pt-20">
      {" "}
      <Sidebar />
      <div className="flex-1 px-6 py-8">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <h1 className="text-3xl font-semibold">Edit Product</h1>

          {/* PRODUCT NAME */}

          <input
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            placeholder="Product Name"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3"
          />

          {/* DESCRIPTION */}

          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3"
          />

          {/* CATEGORY TREE */}

          <div className="relative">
            <button
              type="button"
              onClick={() => setCategoryOpen(!categoryOpen)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-left"
            >
              {categories.find((c) => c._id === formData.productCategory)
                ?.categoryName || "Select Category"}
            </button>

            {categoryOpen && (
              <div className="absolute z-50 mt-2 w-full bg-black border border-white/10 rounded-xl max-h-80 overflow-y-auto">
                {renderTree(treeCategories)}
              </div>
            )}
          </div>

          {/* VARIANTS */}

          <div>
            <div className="flex justify-between">
              <h2 className="text-xl">Variants</h2>

              <button
                type="button"
                onClick={addVariant}
                className="bg-[#f87171] px-3 py-1 rounded"
              >
                + Add
              </button>
            </div>

            {formData.variants.map((v, index) => (
              <div
                key={v._id || index}
                className="mt-4 bg-white/5 p-4 rounded-lg space-y-3"
              >
                
                <Dropdown
                    value={v.size}
                    onChange={(e) =>
                      updateVariant(index,"size",e.target.value)
                    }
                  >
                    <option>XS</option>
                    <option>S</option>
                    <option>M</option>
                    <option>L</option>
                    <option>XL</option>
                    <option>XXL</option>
                  </Dropdown>

                <input
                  placeholder="Color"
                  value={v.color || ""}
                  onChange={(e) =>
                    updateVariant(index, "color", e.target.value)
                  }
                  className="w-full bg-black/40 p-2 rounded"
                />

                <Dropdown
                  value={v.audience || "unisex"}
                  onChange={(e) =>
                    updateVariant(index, "audience", e.target.value)
                  }
                  
                >
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
                  <option value="unisex">Unisex</option>
                </Dropdown>

                <input
                  type="number"
                  placeholder="Price"
                  value={v.price}
                  onChange={(e) =>
                    updateVariant(index, "price", e.target.value)
                  }
                  className="w-full bg-black/40 p-2 rounded"
                />

                <input
                  type="number"
                  placeholder="Stock"
                  value={v.stock}
                  onChange={(e) =>
                    updateVariant(index, "stock", e.target.value)
                  }
                  className="w-full bg-black/40 p-2 rounded"
                />

                {/* IMAGE PREVIEW */}

                <div className="flex gap-3 flex-wrap">
                  {v.images?.map((img, i) => (
                    <div key={i} className="relative">
                      <img
                        src={
                          img instanceof File ? URL.createObjectURL(img) : img
                        }
                        className="w-20 h-20 object-cover rounded"
                      />

                      <button
                        type="button"
                        onClick={() => removeVariantImage(index, i)}
                        className="absolute top-0 right-0 bg-red-500 text-xs px-1 rounded"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <input
                  type="file"
                  multiple
                  onChange={(e) => handleVariantImage(index, e.target.files)}
                />

                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="text-red-400"
                >
                  Remove Variant
                </button>
              </div>
            ))}
          </div>

          {/* BUTTONS */}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-[#f87171] rounded"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="border border-white/20 px-6 py-3 rounded"
            >
              Cancel
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default EditProduct;
