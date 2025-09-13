// src/pages/Signup.jsx
import { useState } from "react";

export default function Signup() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup Data:", formData);
    // later: send to backend or Firebase
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-centre" style={{backgroundImage : "url('/download.jpeg')"}}>
   
      <form onSubmit={handleSubmit} className="bg-purple-200 shadow-lg rounded-lg p-6 w-full max-w-sm">
        <h2 className=" text-purple-500 text-2xl font-bold text-center mb-4">Sign Up</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
        />

        <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
          Sign Up
        </button>
        <p className="text-sm text-center mt-3">
          Already have an account? <a href="/login" className="text-purple-600 underline">Login</a>
        </p>
      </form>
    </div>
   
  );
}
