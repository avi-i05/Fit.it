import React, { useState } from "react";
import { Link } from "react-router-dom";

const orderStatus = ["pending", "shipped", "delivered", "cancelled"];

function NavLinks({ onClick }) {
  return (
    <ul className="space-y-2 text-sm">

      <li>
        <Link
          to="/"
          onClick={onClick}
          className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition"
        >
          Dashboard
        </Link>
      </li>

      <li>
        <Link
          to="/consumer"
          onClick={onClick}
          className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition"
        >
          Consumers
        </Link>
      </li>
      <li>
        <Link
          to="/categories"
          onClick={onClick}
          className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition"
        >
          Categories
        </Link>
      </li>

      <li>
        <Link
          to="/seller"
          onClick={onClick}
          className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition"
        >
          Sellers
        </Link>
      </li>

      <li>
        <Link
          to="/product"
          onClick={onClick}
          className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition"
        >
          Products
        </Link>
      </li>

      {/* ===== ORDERS DROPDOWN ===== */}
      <li>
        <details className="group">
          <summary  className="cursor-pointer list-none px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition flex justify-between">
            <Link to="/order" onClick={onClick} className="flex-1">
            Orders
            </Link> 
            <span className="text-xs group-open:rotate-90 transition">▸</span>
          </summary>

          <ul className="ml-4 mt-2 space-y-1">

            {/* EXPRESS */}
            <li>
              <details>
                <summary className="cursor-pointer list-none px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition">
                  <Link to="/order?type=express" onClick={onClick} className="flex-1">
                    Express Orders
                  </Link>
                </summary>

                <ul className="ml-4 space-y-1">
                  {orderStatus.map((status) => (
                    <li key={status}>
                      <Link
                        to={`/order?type=express&status=${status}`}
                        onClick={onClick}
                        className="block px-4 py-1 rounded text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition"
                      >
                        {status}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            </li>

            {/* FEATURED */}
            <li>
              <details>
                <summary className="cursor-pointer list-none px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition">
                  <Link to="/order?type=featured" onClick={onClick} className="flex-1">
                  Featured Orders
                  </Link>
                </summary>

                <ul className="ml-4 space-y-1">
                  {orderStatus.map((status) => (
                    <li key={status}>
                      <Link
                        to={`/order?type=featured&status=${status}`}
                        onClick={onClick}
                        className="block px-4 py-1 rounded text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition"
                      >
                        {status}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            </li>

            {/* STANDARD */}
            <li>
              <details>
                <summary className="cursor-pointer list-none px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition">
                  <Link to="/order?type=standard" onClick={onClick} className="flex-1">
                    Standard Orders
                  </Link>
                </summary>

                <ul className="ml-4 space-y-1">
                  {orderStatus.map((status) => (
                    <li key={status}>
                      <Link
                        to={`/order?type=standard&status=${status}`}
                        onClick={onClick}
                        className="block px-4 py-1 rounded text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition"
                      >
                        {status}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            </li>

          </ul>
        </details>
      </li>

      <li>
        <Link
          to="/settings"
          onClick={onClick}
          className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition"
        >
          Settings
        </Link>
      </li>

    </ul>
  );
}

function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* MOBILE HEADER */}
      <div className="md:hidden flex items-center justify-between bg-white p-4 shadow">
        <h2 className="text-lg font-semibold text-gray-800">Admin Panel</h2>
        <button onClick={() => setOpen(true)} className="text-2xl">☰</button>
      </div>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
        />
      )}

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white p-5 shadow-lg z-50 transform transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <NavLinks onClick={() => setOpen(false)} />
      </div>

      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:block w-64 h-[600px] bg-white p-6 shadow-md fixed top-16 left-0">
        <NavLinks />
      </div>
    </>
  );
}

export default Sidebar;
