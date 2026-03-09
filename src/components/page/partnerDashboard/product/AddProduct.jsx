import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../dashboard/Sidebar";
import api from "../../../../api/axios";
import { createProduct } from "../../../../api/product";

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

const AddProduct = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [product, setProduct] = useState({
    productName: "",
    description: "",
    productCategory: "",
    highlights: []
  });

  const [variants, setVariants] = useState([
    {
      price: "",
      stock: "",
      size: "M",
      color: "",
      images: [],
      audience: "men",
      isActive: true
    }
  ]);

  /* ================= MOBILE DETECTION ================= */

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /* ================= FETCH CATEGORIES ================= */

  useEffect(() => {
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

    fetchCategories();
  }, []);

  /* ================= BUILD CATEGORY TREE ================= */

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

  /* ================= TREE EXPAND ================= */

  const toggleExpand = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  /* ================= TREE RENDER ================= */

  const renderTree = (nodes, level = 0) => {
    return nodes.map((node) => (
      <div key={node._id}>
        <div
          className="flex items-center justify-between py-3 px-4 hover:bg-white/10 cursor-pointer border-b border-white/5"
          style={{ paddingLeft: `${16 + level * 16}px` }}
        >
          <span
            className={`flex-1 ${
              product.productCategory === node._id
                ? "text-green-400"
                : ""
            }`}
            onClick={() => {
              setProduct({
                ...product,
                productCategory: node._id
              });
              setCategoryOpen(false);
            }}
          >
            {node.categoryName}
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

  /* ================= PRODUCT CHANGE ================= */

  const handleProductChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  /* ================= VARIANT CHANGE ================= */

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  /* ================= IMAGE UPLOAD ================= */

  const handleImageUpload = (index, e) => {
    const files = Array.from(e.target.files);
    const updated = [...variants];
    updated[index].images = [...updated[index].images, ...files];
    setVariants(updated);
  };

  const removeImage = (variantIndex, imageIndex) => {
    const updated = [...variants];
    updated[variantIndex].images.splice(imageIndex, 1);
    setVariants(updated);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        price: "",
        stock: "",
        size: "M",
        color: "",
        images: [],
        audience: "men",
        isActive: true
      }
    ]);
  };

  /* ================= HIGHLIGHTS ================= */

  const addHighlightSection = () => {
    setProduct({
      ...product,
      highlights: [
        ...product.highlights,
        { sectionTitle: "", type: "list", content: [""] }
      ]
    });
  };

  const handleHighlightChange = (index, field, value) => {
    const updated = [...product.highlights];
    updated[index][field] = value;
    setProduct({ ...product, highlights: updated });
  };

  const handleHighlightListItem = (hIndex, itemIndex, value) => {
    const updated = [...product.highlights];
    updated[hIndex].content[itemIndex] = value;
    setProduct({ ...product, highlights: updated });
  };

  const addListItem = (index) => {
    const updated = [...product.highlights];
    updated[index].content.push("");
    setProduct({ ...product, highlights: updated });
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("product", JSON.stringify(product));
      formData.append("productVariants", JSON.stringify(variants));

      variants.forEach((variant, index) => {
        variant.images.forEach((image) => {
          formData.append(`variantImages_${index}`, image);
        });
      });

      await createProduct(formData);

      setSuccess(true);

      setTimeout(() => {
        navigate("/partner/products");
      }, 1200);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = categories.find(
    (c) => c._id === product.productCategory
  );

  return (
    <div className="min-h-screen bg-black text-white flex pt-[80px]">
      <Sidebar />

      <div className="flex-1 px-6 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-2xl font-semibold mb-6">
            Add Product
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* PRODUCT NAME */}
            <input
              name="productName"
              placeholder="Product Name"
              value={product.productName}
              onChange={handleProductChange}
              className="w-full bg-white/10 p-3 rounded-xl border border-white/10"
              required
            />

            {/* DESCRIPTION */}
            <textarea
              name="description"
              placeholder="Description"
              value={product.description}
              onChange={handleProductChange}
              className="w-full bg-white/10 p-3 rounded-xl border border-white/10"
              required
            />

            {/* CATEGORY TREE SELECTOR */}
            <div className="relative">

              <div
                onClick={() => setCategoryOpen(true)}
                className="w-full bg-white/10 border border-white/10 p-3 rounded-xl cursor-pointer"
              >
                {selectedCategory
                  ? selectedCategory.categoryName
                  : "Select Category"}
              </div>

              {!isMobile && categoryOpen && (
                <div className="absolute w-full mt-2 bg-black border border-white/10 rounded-xl max-h-72 overflow-auto z-50">
                  {renderTree(treeCategories)}
                </div>
              )}
            </div>

            {isMobile && categoryOpen && (
              <div className="fixed inset-0 bg-black/70 z-50 flex items-end">
                <div className="bg-black w-full max-h-[80vh] rounded-t-2xl overflow-auto">
                  <div className="p-4 border-b border-white/10 flex justify-between">
                    <span>Select Category</span>
                    <button onClick={() => setCategoryOpen(false)}>
                      Close
                    </button>
                  </div>

                  {renderTree(treeCategories)}
                </div>
              </div>
            )}

            {/* HIGHLIGHTS */}
            <div>
              <h2 className="text-lg font-medium mb-3">
                Product Highlights
              </h2>

              {product.highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3 mb-4"
                >

                  <input
                    placeholder="Section Title"
                    value={highlight.sectionTitle}
                    onChange={(e) =>
                      handleHighlightChange(
                        index,
                        "sectionTitle",
                        e.target.value
                      )
                    }
                    className="w-full bg-white/10 p-3 rounded-xl"
                  />

                  <Dropdown
                    value={highlight.type}
                    onChange={(e) =>
                      handleHighlightChange(
                        index,
                        "type",
                        e.target.value
                      )
                    }
                  >
                    <option value="list">List</option>
                    <option value="text">Text</option>
                  </Dropdown>

                  {highlight.type === "list" &&
                    highlight.content.map((item, itemIndex) => (
                      <input
                        key={itemIndex}
                        placeholder="List Item"
                        value={item}
                        onChange={(e) =>
                          handleHighlightListItem(
                            index,
                            itemIndex,
                            e.target.value
                          )
                        }
                        className="w-full bg-white/10 p-3 rounded-xl"
                      />
                    ))}

                  {highlight.type === "list" && (
                    <button
                      type="button"
                      onClick={() => addListItem(index)}
                      className="text-sm bg-white text-black px-3 py-1 rounded"
                    >
                      Add Item
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addHighlightSection}
                className="px-4 py-2 bg-white text-black rounded-xl"
              >
                Add Highlight Section
              </button>
            </div>

            {/* VARIANTS */}
            <div>
              <h2 className="text-lg font-medium mb-3">
                Variants
              </h2>

              {variants.map((variant, index) => (
                <div
                  key={index}
                  className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10 mb-4"
                >

                  <input
                    type="number"
                    placeholder="Price"
                    value={variant.price}
                    onChange={(e) =>
                      handleVariantChange(index,"price",e.target.value)
                    }
                    className="w-full bg-white/10 p-3 rounded-xl"
                  />

                  <input
                    type="number"
                    placeholder="Stock"
                    value={variant.stock}
                    onChange={(e) =>
                      handleVariantChange(index,"stock",e.target.value)
                    }
                    className="w-full bg-white/10 p-3 rounded-xl"
                  />

                  <Dropdown
                    value={variant.size}
                    onChange={(e) =>
                      handleVariantChange(index,"size",e.target.value)
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
                    value={variant.color}
                    onChange={(e) =>
                      handleVariantChange(index,"color",e.target.value)
                    }
                    className="w-full bg-white/10 p-3 rounded-xl"
                  />

                  <Dropdown
                    value={variant.audience}
                    onChange={(e) =>
                      handleVariantChange(index,"audience",e.target.value)
                    }
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                    <option value="unisex">Unisex</option>
                  </Dropdown>

                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleImageUpload(index, e)}
                  />

                  <div className="flex gap-3 flex-wrap">
                    {variant.images.map((img, imgIndex) => (
                      <div key={imgIndex} className="relative">
                        <img
                          src={URL.createObjectURL(img)}
                          alt="preview"
                          className="w-20 h-20 object-cover rounded"
                        />

                        <button
                          type="button"
                          onClick={() => removeImage(index, imgIndex)}
                          className="absolute top-0 right-0 bg-red-500 text-xs px-1 rounded"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>

                </div>
              ))}

              <button
                type="button"
                onClick={addVariant}
                className="px-4 py-2 bg-white text-black rounded-xl"
              >
                Add Variant
              </button>
            </div>

            {success && (
              <p className="text-green-400">
                Product created successfully
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-3 rounded-xl font-semibold"
            >
              {loading ? "Creating Product..." : "Create Product"}
            </button>

          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddProduct;