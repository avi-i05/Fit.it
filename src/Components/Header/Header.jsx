import React from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function Header() {
  return (
    <header className="shadow sticky z-50 top-0">
      <nav className="bg-gradient-to-r from-pink-300 via-purple-400 to-blue-300 px-4 lg:px-6 py-2.5 text-white">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/favicon.ico.jpg"
              className="mr-3 h-14 rounded-full border-2 border-white shadow-lg"
              alt="Logo"
            />
            <span className="font-bold text-xl tracking-wide">Fashion Delivery</span>
          </Link>

          {/* Menu */}
          <div
            className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              {[
                { to: "/", label: "Home" },
                { to: "NewOrders", label: "New Orders" },
                { to: "OrderStatus", label: "Order Status" },
                { to: "OrderCompletion", label: "Order Completion" },
                { to: "StockedPage", label: "Stocked Page" },
                { to: "StockForm", label: "Stock Form" },
                { to: "PolicySupport", label: "Policy Support" },
                { to: "Profile", label: "Profile" },
              ].map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `block py-2 pr-4 pl-3 duration-200 ${
                        isActive ? 'text-yellow-300' : 'text-white'
                      } border-b border-transparent hover:bg-white/20 lg:hover:bg-transparent lg:border-0 hover:text-yellow-300 lg:p-0 rounded transition`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}
