import React, { useState } from "react";

const OrderStatus = () => {
  const [orders] = useState([
    { id: 1, customer: "Alice", product: "Shoes", status: "Pending" },
    { id: 2, customer: "Bob", product: "Shirt", status: "Accepted" },
    { id: 3, customer: "Charlie", product: "Watch", status: "Rejected" },
    { id: 4, customer: "Diana", product: "Handbag", status: "Pending" },
    { id: 5, customer: "Ethan", product: "Jacket", status: "Accepted" },
  ]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Accepted":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-purple-700 mb-6">📊 Order Status</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-lg overflow-hidden shadow-lg">
          <thead>
            <tr className="bg-purple-600 text-white text-left">
              <th className="px-6 py-3">Order ID</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Product</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="even:bg-gray-50 hover:bg-purple-50 transition">
                <td className="px-6 py-4 font-medium">#{o.id}</td>
                <td className="px-6 py-4">{o.customer}</td>
                <td className="px-6 py-4">{o.product}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(o.status)}`}>
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderStatus;