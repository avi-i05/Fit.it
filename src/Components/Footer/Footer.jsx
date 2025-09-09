import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center text-xs md:text-sm space-y-2 md:space-y-0">
        
        {/* Left: Logo + Name */}
        <div className="flex items-center gap-2">
          <img src="/favicon.ico.jpg" className="h-8 rounded-md" alt="Logo" />
          <span className="font-semibold text-white">Fashion Delivery</span>
        </div>

        {/* Center: Links */}
        <div className="flex gap-4 md:gap-6">
          <Link to="/" className="hover:text-purple-400 transition">Home</Link>
          <Link to="/about" className="hover:text-purple-400 transition">About</Link>
          <Link to="/contact" className="hover:text-purple-400 transition">Contact</Link>
          <Link to="/policy" className="hover:text-purple-400 transition">Policies</Link>
        </div>

        {/* Right: Socials + Back to Top */}
        <div className="flex items-center gap-3 md:gap-4">
          <a
            href="https://github.com/YourGitHubUsername"
            target="_blank"
            rel="noreferrer"
            className="hover:text-purple-400 transition"
          >
            <i className="fab fa-github"></i> GitHub
          </a>
          <a
            href="https://linkedin.com/in/YourLinkedInUsername"
            target="_blank"
            rel="noreferrer"
            className="hover:text-purple-400 transition"
          >
            <i className="fab fa-linkedin"></i> LinkedIn
          </a>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="px-2 py-1 bg-purple-600 text-white rounded-sm hover:bg-purple-700 transition"
          >
            ↑ Top
          </button>
        </div>
      </div>

      {/* Bottom line */}
      <div className="border-t border-gray-700 mt-2 pt-2 text-center text-gray-400 text-xs md:text-sm">
        © {new Date().getFullYear()} Fashion Delivery. All rights reserved.
      </div>
    </footer>
  );
}
