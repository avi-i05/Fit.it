import React from "react";

const StockedPage = ({ stocks = [] }) => {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-purple-700 flex items-center">
        📦 Stocked Items
      </h2>

      {stocks.length === 0 ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <p className="text-gray-700 italic">No stocks added yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden shadow-lg">
            <thead>
              <tr className="bg-purple-600 text-white text-left">
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Quantity</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((s, i) => (
                <tr
                  key={i}
                  className="even:bg-gray-50 hover:bg-purple-50 transition"
                >
                  <td className="px-6 py-4 font-medium">{i + 1}</td>
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {s.product}
                  </td>
                  <td className="px-6 py-4">{s.qty}</td>
                  <td className="px-6 py-4 font-semibold text-green-600">
                    ${s.price}
                  </td>
                  <td className="px-6 py-4">
                    {s.qty > 0 ? (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                        In Stock
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-600">
                        Out of Stock
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StockedPage;
