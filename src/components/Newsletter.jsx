import React, { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const subscribe = (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMsg("Please enter a valid email address.");
      return;
    }
    setMsg("Thanks for subscribing! You'll hear from us soon.");
    setEmail("");
  };

  return (
    <section className="bg-white py-12">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Stay in the loop</h3>
        <p className="text-gray-600 mb-6">Stay updated with the latest trends and offers.</p>
        <form onSubmit={subscribe} className="flex flex-col sm:flex-row gap-3 justify-center">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter your email"
            className="flex-1 min-w-0 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          />
          <button type="submit" className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Subscribe</button>
        </form>
        {msg && <p className="mt-3 text-sm text-emerald-600 animate-fade-in">{msg}</p>}
      </div>
    </section>
  );
};

export default Newsletter;
