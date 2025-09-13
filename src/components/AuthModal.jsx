import React, { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";

const AuthModal = ({ open, onClose, defaultMode = "login" }) => {
  const { login, register } = useContext(AuthContext);
  const [mode, setMode] = useState(defaultMode); // 'login' or 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
    remember: false,
  });

  if (!open) return null;

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submission
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);

      if (mode === "login") {
        if (!form.email || !form.password) {
          throw new Error("Email and password are required.");
        }
        await login({ email: form.email, password: form.password });
        onClose();
      } else {
        if (!form.name || !form.email || !form.password || !form.confirmPassword) {
          throw new Error("All fields are required.");
        }
        if (form.password !== form.confirmPassword) {
          throw new Error("Passwords do not match.");
        }
        if (!form.terms) {
          throw new Error("You must accept the terms and conditions.");
        }
        await register({
          name: form.name,
          email: form.email,
          password: form.password,
        });
        onClose();
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 rounded-lg transition ${
              mode === "login"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-2 rounded-lg transition ${
              mode === "register"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Register
          </button>
          <button
            onClick={onClose}
            className="ml-auto text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Heading */}
        <div className="mb-5 text-center">
          <h3 className="text-2xl font-bold text-gray-800">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h3>
          <p className="text-sm text-gray-600">
            {mode === "login"
              ? "Sign in to your account to continue shopping"
              : "Sign up to start your fast fashion journey"}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-3 text-sm text-red-600 animate-shake">{error}</div>
        )}

        {/* Form */}
        <form onSubmit={submit} className="space-y-4">
          {mode === "register" && (
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full border border-gray-300 bg-white text-gray-800 p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />
          )}

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full border border-gray-300 bg-white text-gray-800 p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full border border-gray-300 bg-white text-gray-800 p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          />

          {mode === "register" && (
            <>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full border border-gray-300 bg-white text-gray-800 p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              />
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  name="terms"
                  checked={form.terms}
                  onChange={handleChange}
                />
                I agree to the Terms and Conditions
              </label>
            </>
          )}

          {mode === "login" && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                />
                Remember me
              </label>
              <button
                type="button"
                className="text-purple-600 hover:underline"
                onClick={() => alert("Password reset flow coming soon!")}
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-purple-600 text-white py-2.5 rounded-lg hover:bg-purple-700 active:scale-[.98] transition disabled:opacity-60 shadow-sm hover:shadow"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Sign In"
              : "Create Account"}
          </button>

          {mode === "login" && (
            <>
              <div className="flex items-center gap-4 my-2">
                <div className="h-px bg-gray-200 flex-1" />
                <span className="text-xs text-gray-500">Or continue with</span>
                <div className="h-px bg-gray-200 flex-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="w-full border rounded-lg py-2 hover:bg-gray-50 transition active:scale-[.98]"
                >
                  Google
                </button>
                <button
                  type="button"
                  className="w-full border rounded-lg py-2 hover:bg-gray-50 transition active:scale-[.98]"
                >
                  Facebook
                </button>
              </div>
            </>
          )}
        </form>

        {/* Footer */}
        <p className="text-sm text-center mt-4">
          {mode === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <button
            className="text-purple-600 hover:underline"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? "Sign up for free" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
