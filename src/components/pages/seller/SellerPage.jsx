import React, { useContext, useState } from "react";
import Sidebar from "../../sidebar/Sidebar";
import { useLoaderData } from "react-router-dom";
import ToastContext from "../../../context/ToastContext.js";

function SellerPage() {
  const loaderData = useLoaderData();
  const { showToast } = useContext(ToastContext);

  const [seller, setSeller] = useState(loaderData?.data || {});
  const [loading, setLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const [showProducts, setShowProducts] = useState(false);

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const {
    _id,
    fullName,
    brandName,
    sellerType,
    storeName,
    storeImage,
    ownerImage,
    email,
    phoneNumber,
    isVerified,
    createdAt,
    govtID,
    govtIDImage,
    gstNumber,
    address = {},
  } = seller;

  const handleVerification = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/partners/update-verified/${_id}`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSeller((prev) => ({ ...prev, isVerified: true }));

        showToast({
          message: data.message || "Seller verified successfully",
          type: "success",
        });
      } else {
        showToast({
          message: data.message || "Something went wrong",
          type: "error",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const blockSeller = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/partners/block-seller/${_id}`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSeller((prev) => ({
          ...prev,
          isVerified: false,
          isBlocked: true,
        }));

        showToast({
          message: "Seller blocked successfully",
          type: "success",
        });
      } else {
        showToast({
          message: data.message || "Something went wrong",
          type: "error",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getSellerProducts = async (pageNumber = 1) => {
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/products/seller-products/${_id}?page=${pageNumber}&limit=9`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setProducts(data.data.products || []);
        setPagination(data.data.pagination);
        setPage(pageNumber);
        setShowProducts(true);
      } else {
        showToast({
          message: data.message || "Failed to load products",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching seller products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />

      <div className="md:ml-64 p-4 md:p-6">

        {/* HEADER */}
        <div className="sticky top-0 z-10 bg-gray-100 pb-3 mb-4 border-b">
          <h1 className="text-xl md:text-3xl font-semibold text-gray-800">
            Seller Profile
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Complete seller details and verification information
          </p>
        </div>

        {/* SELLER PROFILE */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row gap-5 items-center">

          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-700">
            {ownerImage ? (
              <img
                src={ownerImage}
                alt="Owner"
                className="w-full h-full object-cover"
              />
            ) : (
              fullName?.charAt(0)?.toUpperCase() || "S"
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-gray-800">
              {brandName}
            </h2>

            <p className="text-sm text-gray-600">Store: {storeName}</p>
            <p className="text-sm text-gray-600">Owner: {fullName}</p>

            <span
              className={`inline-block mt-2 px-3 py-1 text-xs rounded-full font-medium ${
                isVerified
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {isVerified ? "Verified Seller" : "Pending Verification"}
            </span>
          </div>

          {storeImage && (
            <img
              src={storeImage}
              alt="Store"
              className="w-36 h-24 object-cover rounded-lg border"
            />
          )}
        </div>

        {/* SELLER STATS */}
        <div className="grid grid-cols-2 gap-4 mt-4">
        

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Seller Type</p>
            <p className="text-xl font-semibold capitalize">{sellerType}</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Joined</p>
            <p className="text-xl font-semibold">
              {createdAt
                ? new Date(createdAt).toLocaleDateString()
                : "—"}
            </p>
          </div>
        </div>

        {/* BASIC INFO */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-3">
              Basic Information
            </h3>

            <div className="space-y-2 text-sm text-gray-700">
              <p><b>Email:</b> {email}</p>
              <p><b>Phone:</b> {phoneNumber}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-3">
              Government & Tax
            </h3>

            <div className="space-y-2 text-sm text-gray-700">
              <p><b>Govt ID:</b> {govtID}</p>
              <p><b>GST:</b> {gstNumber || "N/A"}</p>

              {govtIDImage && (
                <img
                  src={govtIDImage}
                  alt="Govt ID"
                  className="mt-3 w-full max-w-xs rounded-lg border"
                />
              )}
            </div>
          </div>

        </div>

        {/* ADDRESS */}
        <div className="mt-4 bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-3">Address</h3>

          <div className="grid md:grid-cols-2 gap-6">

            <div className="text-sm space-y-1 text-gray-700">
              <p>{address.addressLine1}</p>
              <p>{address.addressLine2}</p>
              <p>{[address.city, address.state].filter(Boolean).join(", ")}</p>
              <p>
                {[address.postalCode, address.country]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>


          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-4 bg-white rounded-xl shadow p-6 flex flex-wrap gap-3">

          <button
            className="px-5 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50"
            onClick={handleVerification}
            disabled={loading || isVerified}
          >
            {isVerified ? "Verified Seller" : "Verify Seller"}
          </button>

          <button
            className="px-5 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50"
            onClick={blockSeller}
            disabled={loading || !isVerified}
          >
            Block Seller
          </button>

          <button
            className="px-5 py-2 border rounded-lg"
            onClick={() => getSellerProducts(1)}
          >
            View Products
          </button>

        </div>

        {/* PRODUCTS */}
        {showProducts && (
          <div className="mt-6 bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">
              Seller Products ({pagination?.total})
            </h3>

            {products.length === 0 ? (
              <p className="text-sm text-gray-500">No products found.</p>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="border rounded-lg p-4 space-y-2"
                    >
                      <h4 className="font-semibold text-gray-800">
                        {product.productName}
                      </h4>

                      <p className="text-xs text-gray-500">
                        {product.description}
                      </p>

                      <p className="text-sm">
                        <b>Variants:</b> {product.variants?.length || 0}
                      </p>

                      {product.variants.map((variant) => (
                        <div
                          key={variant._id}
                          className="flex justify-between text-xs border rounded px-2 py-1"
                        >
                          <span>
                            {variant.size} / {variant.color}
                          </span>
                          <span>₹{variant.price}</span>
                          <span>Stock: {variant.stock}</span>
                        </div>
                      ))}

                    </div>
                  ))}

                </div>

                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-6 flex justify-center items-center gap-3">

                    <button
                      className="px-3 py-1 border rounded disabled:opacity-50"
                      disabled={page === 1}
                      onClick={() => getSellerProducts(page - 1)}
                    >
                      Prev
                    </button>

                    <span className="text-sm">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>

                    <button
                      className="px-3 py-1 border rounded disabled:opacity-50"
                      disabled={page === pagination.totalPages}
                      onClick={() => getSellerProducts(page + 1)}
                    >
                      Next
                    </button>

                  </div>
                )}
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default SellerPage;