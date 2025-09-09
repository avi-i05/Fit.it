import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  // Dummy stats (you can later fetch from API)
  const stats = [
    { title: "Orders Today", value: 24, icon: "📦" },
    { title: "Earnings This Month", value: "₹12,400", icon: "💰" },
    { title: "Pending Deliveries", value: 5, icon: "🚚" },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 md:px-16 py-8">
      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between bg-gradient-to-r from-pink-100 via-white to-purple-100 rounded-2xl shadow-lg p-8 md:p-16 mb-12">
        {/* Text */}
        <div className="text-center md:text-left max-w-lg space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Welcome Back, Partner! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your orders, track deliveries, and view your performance insights at a glance.
          </p>
          <Link
            to="/orders"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"
          >
            Go to Orders
          </Link>
        </div>

        {/* Image */}
        <div className="mb-8 md:mb-0">
          <img
            className="w-72 md:w-96 rounded-2xl shadow-lg"
            src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2"
            alt="Partner Dashboard"
          />
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid gap-6 md:grid-cols-3 mb-12">
        {stats.map((s, i) => (
          <div
            key={i}
            className="p-6 bg-white shadow-lg rounded-2xl hover:shadow-xl transition flex flex-col items-center"
          >
            <div className="text-4xl mb-2">{s.icon}</div>
            <p className="text-2xl font-bold text-purple-700">{s.value}</p>
            <p className="text-gray-600">{s.title}</p>
          </div>
        ))}
      </section>

      {/* Partner Benefits */}
      <section className="grid gap-8 md:grid-cols-3 text-center mb-12">
        <div className="p-6 bg-white shadow-lg rounded-2xl hover:shadow-xl transition">
          <h3 className="text-xl font-semibold mb-2">📦 More Orders</h3>
          <p className="text-gray-600">
            Get access to a large base of clothing customers daily.
          </p>
        </div>
        <div className="p-6 bg-white shadow-lg rounded-2xl hover:shadow-xl transition">
          <h3 className="text-xl font-semibold mb-2">💰 Higher Earnings</h3>
          <p className="text-gray-600">
            Earn more with every order and exclusive partner rewards.
          </p>
        </div>
        <div className="p-6 bg-white shadow-lg rounded-2xl hover:shadow-xl transition">
          <h3 className="text-xl font-semibold mb-2">📊 Easy Management</h3>
          <p className="text-gray-600">
            Track inventory, accept orders, and view performance insights.
          </p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="text-center py-12 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Quick Actions</h2>
        <p className="mb-6 text-lg">Easily manage your business with the following actions:</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/OrderStatus"
            className="px-6 py-3 bg-white text-purple-700 font-medium rounded-lg shadow hover:bg-gray-100 transition"
          >
            View Orders
          </Link>
          <Link
            to="/StockedPage"
            className="px-6 py-3 bg-white text-purple-700 font-medium rounded-lg shadow hover:bg-gray-100 transition"
          >
            Manage Stock
          </Link>
          <Link
            to="/Profile"
            className="px-6 py-3 bg-white text-purple-700 font-medium rounded-lg shadow hover:bg-gray-100 transition"
          >
            Update Profile
          </Link>
          <Link
            to="/PolicySupport"
            className="px-6 py-3 bg-white text-purple-700 font-medium rounded-lg shadow hover:bg-gray-100 transition"
          >
            Support
          </Link>
        </div>
      </section>
    </div>
  );
}
