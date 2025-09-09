import React, { useState } from "react";

const NewOrders = () => {
  const [orders, setOrders] = useState([
    { id: 1, customer: "Alice", product: "Shoes", qty: 2, status: "Pending", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 2, customer: "Bob", product: "Shirt", qty: 1, status: "Pending", img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 3, customer: "Charlie", product: "Watch", qty: 1, status: "Pending", img: "https://images.unsplash.com/photo-1511389026070-a14ae610a1be" },
    { id: 4, customer: "Diana", product: "Handbag", qty: 1, status: "Pending", img: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f" },
    { id: 5, customer: "Ethan", product: "Jacket", qty: 2, status: "Pending", img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 6, customer: "Fiona", product: "Sunglasses", qty: 1, status: "Pending", img: "https://images.unsplash.com/photo-1624545104844-0d342896e7a6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 7, customer: "George", product: "Jeans", qty: 3, status: "Pending", img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b" },
    { id: 8, customer: "Hannah", product: "Dress", qty: 1, status: "Pending", img: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?q=80&w=780&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  ]);

  const handleUpdate = (id, status) => {
    setOrders(orders.map(o => (o.id === id ? { ...o, status } : o)));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-purple-700 mb-6">📦 New Orders</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orders.map(o => (
          <div
            key={o.id}
            className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 hover:shadow-xl transition"
          >
            {/* Product Image */}
            <div className="mb-4">
              <img
                src={o.img}
                alt={o.product}
                className="w-full h-48 object-cover rounded-lg shadow"
              />
            </div>

            <p className="text-lg"><strong>Customer:</strong> {o.customer}</p>
            <p><strong>Product:</strong> {o.product}</p>
            <p><strong>Qty:</strong> {o.qty}</p>
            <p className="mb-4"><strong>Status:</strong> 
              <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                o.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                o.status === "Accepted" ? "bg-green-100 text-green-700" :
                "bg-red-100 text-red-700"
              }`}>
                {o.status}
              </span>
            </p>

            {o.status === "Pending" && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleUpdate(o.id, "Accepted")}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  ✅ Accept
                </button>
                <button
                  onClick={() => handleUpdate(o.id, "Rejected")}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  ❌ Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewOrders;