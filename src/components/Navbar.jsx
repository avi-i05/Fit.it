import React, { useContext, useState } from 'react'
import { Link } from "react-router-dom"
import { Menu, ShoppingCart, ChevronDown } from "lucide-react";
import { AuthContext } from "../Context/AuthContext";
import { CartContext } from "../Context/CartContext";
import AuthModal from "./AuthModal";
import CartDropdown from "./CartDropdown";

const Navbar = ({ setIsOpen }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { user, logout } = useContext(AuthContext);
  const { itemCount } = useContext(CartContext);

  return (
    <header className="bg-purple-500 text-white shadow-lg relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Fit.It Logo"
            className="w-10 h-10 object-cover rounded-full cursor-pointer hover:scale-110 transition-transform duration-300"
            onClick={() => setIsOpen(true)}
          />
          <div className='flex flex-col leading-tight'>
            <h1 className="text-2xl md:text-2xl font-bold">Fit.It</h1>
            <p className="text-sm md:text-sm">Fast Fashion, Faster Delivery</p>
          </div>
        </div>

        <nav className='hidden md:flex items-center space-x-6 text-white font-medium'>
          <Link to="/">Home</Link>
          <Link to="/new-arrivals">New Arrivals</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:flex items-center bg-white/95 rounded-lg overflow-hidden shadow-sm">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products..."
              className="px-3 py-1.5 text-sm text-gray-700 outline-none"
            />
            <button
              onClick={() => {
                if (!query.trim()) return;
                // Placeholder search behavior
                alert(`Searching for: ${query}`);
              }}
              className="bg-emerald-600 text-white px-3 py-1.5 text-sm hover:bg-emerald-700"
            >
              Search
            </button>
          </div>
          {/* Cart */}
          <div className="relative">
            <button className="relative" onClick={() => setCartOpen((v) => !v)} aria-label="Cart">
              <ShoppingCart />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs rounded-full px-1.5">
                  {itemCount}
                </span>
              )}
            </button>
            <CartDropdown open={cartOpen} />
          </div>

          {/* Auth */}
          {!user ? (
            <button onClick={() => setAuthOpen(true)} className="px-3 py-1 rounded bg-white text-purple-600 hover:bg-gray-100">
              Login / Register
            </button>
          ) : (
            <div className="relative">
              <button onClick={() => setUserMenuOpen((v) => !v)} className="flex items-center gap-2 px-3 py-1 rounded bg-white text-purple-600 hover:bg-gray-100">
                <span className="hidden sm:inline">{user.name}</span>
                <ChevronDown size={16} />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded-md shadow-lg py-1 z-40">
                  <Link to="/profile" className="block px-3 py-2 hover:bg-gray-100">Profile</Link>
                  <button onClick={logout} className="w-full text-left px-3 py-2 hover:bg-gray-100">Logout</button>
                </div>
              )}
            </div>
          )}

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <Menu size={28} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="absolute top-16 left-0 w-full flex flex-col items-start md:hidden bg-purple-600 px-5 py-4 space-y-3">
          <Link to="/" className="block hover:text-gray-200" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/new-arrivals" className="block hover:text-gray-200" onClick={() => setMenuOpen(false)}>New Arrivals</Link>
          <Link to="/shop" className="block hover:text-gray-200" onClick={() => setMenuOpen(false)}>Shop</Link>
          <Link to="/about" className="block hover:text-gray-200" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/contact" className="block hover:text-gray-200" onClick={() => setMenuOpen(false)}>Contact</Link>
          {/* Mobile search */}
          <div className="w-full flex items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full px-3 py-2 text-sm text-gray-800 rounded"
            />
            <button
              onClick={() => {
                if (!query.trim()) return;
                alert(`Searching for: ${query}`);
                setMenuOpen(false);
              }}
              className="px-3 py-2 bg-emerald-600 text-white rounded"
            >Search</button>
          </div>
        </div>
      )}

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  )
}
export default Navbar
