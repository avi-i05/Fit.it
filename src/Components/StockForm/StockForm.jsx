import React, { useState } from "react";

const StockForm = ({ stocks, setStocks }) => {
  const [product, setProduct] = useState("");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Handle image upload & preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();

    if (!product.trim() || !qty || !price) {
      setError("⚠️ Please fill all fields.");
      setSuccess(false);
      return;
    }

    if (qty <= 0 || price <= 0) {
      setError("⚠️ Quantity and Price must be greater than 0.");
      setSuccess(false);
      return;
    }

    // Add new stock item
    setStocks([
      ...stocks,
      { product, qty: Number(qty), price: Number(price), image: preview },
    ]);

    // Reset fields
    setProduct("");
    setQty("");
    setPrice("");
    setImage(null);
    setPreview(null);
    setError("");
    setSuccess(true);

    // Auto-hide success after 2s
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-purple-700 flex items-center">
          ➕ Add Stock
        </h2>

        {/* Feedback messages */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 rounded text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-3 mb-4 rounded text-green-700">
            ✅ Stock added successfully!
          </div>
        )}

        <form onSubmit={handleAdd} className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Product Name
            </label>
            <input
              className="border w-full p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
              placeholder="e.g. T-Shirt"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Quantity
            </label>
            <input
              className="border w-full p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
              placeholder="e.g. 50"
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Price (USD)
            </label>
            <input
              className="border w-full p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
              placeholder="e.g. 20"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Product Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                         file:rounded-lg file:border-0
                         file:text-sm file:font-semibold
                         file:bg-purple-600 file:text-white
                         hover:file:bg-purple-700 cursor-pointer"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-3 w-32 h-32 object-cover rounded-lg shadow"
              />
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition transform hover:scale-[1.02]"
          >
            Add Stock
          </button>
        </form>
      </div>
    </div>
  );
};

export default StockForm;
