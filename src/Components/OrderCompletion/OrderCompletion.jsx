import React, { useState } from "react";

const OrderCompletion = () => {
  const [orders] = useState([
    { id: 1, customer: "Alice", product: "Shoes", status: "Accepted" },
    { id: 2, customer: "Bob", product: "Shirt", status: "Pending" },
    { id: 3, customer: "Charlie", product: "Watch", status: "Rejected" },
  ]);

  const completed = orders.filter((o) => o.status === "Accepted");

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-purple-700">
        ✅ Completed Orders
      </h2>

      {completed.length === 0 ? (
        <p className="text-gray-600 italic">No completed orders yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg shadow">
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {completed.map((o) => (
                <tr key={o.id} className="text-center hover:bg-gray-100">
                  <td className="px-4 py-2 font-semibold">{o.id}</td>
                  <td className="px-4 py-2">{o.customer}</td>
                  <td className="px-4 py-2">{o.product}</td>
                  <td className="px-4 py-2">
                    <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">
                      {o.status}
                    </span>
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

export default OrderCompletion;
