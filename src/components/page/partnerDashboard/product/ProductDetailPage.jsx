import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";
import Sidebar from "../dashboard/Sidebar";
import { getProduct } from "../../../../api/product";

/* ---------------- VARIANT CARD ---------------- */
const VariantCard = ({ variant }) => {
  const [activeImage, setActiveImage] = useState(
    variant.images?.[0] || "https://via.placeholder.com/400"
  );

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
    >
      {/* MAIN IMAGE */}
      <div className="aspect-square">
        <img
          src={activeImage}
          alt={variant.color}
          className="w-full h-full object-cover"
        />
      </div>

      {/* THUMBNAILS */}
      {variant.images?.length > 1 && (
        <div className="flex gap-2 p-2 overflow-x-auto">
          {variant.images.map((img, i) => (
            <img
              key={i}
              src={img}
              onClick={() => setActiveImage(img)}
              className={`w-14 h-14 rounded-md object-cover cursor-pointer border ${
                activeImage === img
                  ? "border-[#f87171]"
                  : "border-white/10"
              }`}
            />
          ))}
        </div>
      )}

      {/* INFO */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold">
          {variant.size} • {variant.color}
        </h3>

        <p className="text-sm text-white/60">
          SKU: {variant.sku}
        </p>

        <div className="flex justify-between">
          <span className="font-semibold">
            ₹{variant.price}
          </span>

          <span className="text-white/60">
            Stock: {variant.stock}
          </span>
        </div>

        <span
          className={`inline-block mt-2 px-3 py-1 rounded-full text-xs ${
            variant.isActive
              ? "bg-green-500/20 text-green-400"
              : "bg-gray-500/20 text-gray-400"
          }`}
        >
          {variant.isActive ? "Active" : "Inactive"}
        </span>
      </div>
    </motion.div>
  );
};

/* ---------------- PRODUCT DETAILS ---------------- */
const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      const { data } = await getProduct(productId);

      console.log(data);

      setProduct(data?.data?.product || null);
      setVariants(data?.data?.variants || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!productId) return;
    fetchProduct();
  }, [productId]);

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading product...
      </div>
    );
  }

  /* ---------------- NOT FOUND ---------------- */
  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Product not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex pt-20">
      <Sidebar />

      <div className="flex-1 px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto space-y-8"
        >
          {/* BACK BUTTON */}
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-white/60 hover:text-white"
          >
            ← Back
          </button>

          {/* ---------------- PRODUCT INFO ---------------- */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h1 className="text-3xl font-semibold mb-3">
                  {product.productName}
                </h1>

                <p className="text-white/70">
                  {product.description}
                </p>

                <p className="text-xs text-white/40 mt-4">
                  Created:{" "}
                  {new Date(product.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* EDIT PRODUCT BUTTON */}
              <button
                onClick={() =>
                  navigate(`/partner/products/edit/${productId}`)
                }
                className="flex items-center gap-2 h-fit px-4 py-2 rounded-lg bg-[#f87171] hover:bg-[#ef4444] transition font-medium"
              >
                <Pencil size={16} />
                Edit Product
              </button>
            </div>
          </div>

          {/* ---------------- HIGHLIGHTS ---------------- */}
          {product.highlights?.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">
                Highlights
              </h2>

              <div className="space-y-4">
                {product.highlights.map((h, i) => (
                  <div key={i}>
                    <h3 className="font-medium mb-1">
                      {h.sectionTitle}
                    </h3>

                    {h.type === "list" && (
                      <ul className="list-disc ml-5 text-white/70">
                        {h.content.map((c, idx) => (
                          <li key={idx}>{c}</li>
                        ))}
                      </ul>
                    )}

                    {h.type === "text" && (
                      <p className="text-white/70">
                        {h.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---------------- VARIANTS ---------------- */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Variants
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {variants.map((variant) => (
                <VariantCard
                  key={variant._id}
                  variant={variant}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetails;