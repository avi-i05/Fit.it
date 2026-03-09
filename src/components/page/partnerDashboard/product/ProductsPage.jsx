import { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Sidebar from "../dashboard/Sidebar";
import { getProducts } from "../../../../api/product";
import AuthContext from "../../../../context/Auth/authcontext";

const Products = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await getProducts(user._id, page, limit);
      setProducts(data?.data?.products || []);
      setPagination(data?.data?.pagination || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?._id) return;
    fetchProducts();
  }, [user?._id, page]);

  /* ✅ RESTORE SCROLL POSITION WHEN COMING BACK */
  useEffect(() => {
    const savedPosition = sessionStorage.getItem(
      "productsScrollPosition"
    );

    if (savedPosition) {
      window.scrollTo(0, parseInt(savedPosition, 10));
      sessionStorage.removeItem("productsScrollPosition");
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading products...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex pt-20">
      <Sidebar />

      <div className="flex-1 ml-0 px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">
              Products ({pagination?.total || 0})
            </h1>

            <button
              onClick={() => navigate("/partner/products/new")}
              className="px-4 py-2 rounded-xl bg-white text-black font-medium hover:bg-white/90 transition"
            >
              Add Product
            </button>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4">
                📦
              </div>
              <h2 className="text-lg font-semibold">
                No products found
              </h2>
              <p className="text-white/60 text-sm mt-2">
                Add your first product to start selling
              </p>
            </div>
          ) : (
            <>
              {/* PRODUCT CARDS */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => {
                  const variant = product.variants?.[0] || {};
                  const image =
                    variant.images?.[0] ||
                    "https://via.placeholder.com/400";

                  return (
                    <motion.div
                      key={product._id}
                      whileHover={{ y: -6 }}
                      onClick={() => {
                        /* ✅ SAVE SCROLL POSITION */
                        sessionStorage.setItem(
                          "productsScrollPosition",
                          window.scrollY
                        );

                        navigate(
                          `/partner/products/${product._id}`
                        );
                      }}
                      className="cursor-pointer bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition"
                    >
                      <div className="aspect-square bg-black/40">
                        <img
                          src={image}
                          alt={product.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="p-4 space-y-3">
                        <div>
                          <h2 className="font-semibold text-lg line-clamp-1">
                            {product.productName}
                          </h2>

                          <p className="text-xs text-white/50">
                            {variant.size} • {variant.color}
                          </p>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold">
                            ₹{variant.price || 0}
                          </span>

                          <span className="text-sm text-white/60">
                            Stock: {variant.stock ?? 0}
                          </span>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-white/10">
                          <span className="text-xs text-white/50">
                            {variant.audience || "—"}
                          </span>

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              variant.isActive
                                ? "bg-green-500/20 text-green-400"
                                : "bg-gray-500/20 text-gray-400"
                            }`}
                          >
                            {variant.isActive
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </div>

                        <p className="text-xs text-white/40">
                          {new Date(
                            product.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* PAGINATION */}
              {pagination && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-3 py-1 rounded-lg bg-white/10 text-white/70 disabled:opacity-40"
                  >
                    Prev
                  </button>

                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  ).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-3 py-1 rounded-lg ${
                        p === page
                          ? "bg-white text-black"
                          : "bg-white/10 text-white/70 hover:bg-white/20"
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    disabled={page === pagination.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1 rounded-lg bg-white/10 text-white/70 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Products;