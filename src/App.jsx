import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./HomePage";
import Contact from "./components/pages/Contact";
import About from "./components/pages/About";
import Shop from "./components/pages/Shop";
import { CartProvider } from "./Context/CartContext";
import { AuthProvider } from "./Context/AuthContext";
import NewArrivals from "./components/pages/NewArrivals";
import Men from "./components/pages/Men";
import Women from "./components/pages/Women";
import Kids from "./components/pages/Kids";
import Accessories from "./components/pages/Accessories";
import Profile from "./components/pages/Profile";

const AppRoutes = ({ setIsOpen }) => {
  const location = useLocation();
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar setIsOpen={setIsOpen} />
      <div key={location.pathname} className="animate-fade-in">
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/new-arrivals" element={<NewArrivals />} />
          <Route path="/men" element={<Men />} />
          <Route path="/women" element={<Women />} />
          <Route path="/kids" element={<Kids />} />
          <Route path="/accessories" element={<Accessories />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppRoutes setIsOpen={setIsOpen} />

            {isOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300"
                onClick={() => setIsOpen(false)}
              >
                <img
                  src="/logo.png"
                  alt="Enlarged Logo"
                  className="rounded-lg shadow-lg transform scale-100 transition-transform duration-500"
                />
              </div>
            )}
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
