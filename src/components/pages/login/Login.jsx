import { useState, useContext } from "react";
import AuthContext from "../../../context/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import ToastContext from "../../../context/ToastContext";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { showToast } = useContext(ToastContext);


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      showToast({
        message: "Please fill in all fields",
        type: "error",
      });
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/login`,
        {
          method: "POST",
          credentials: "include", 
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();
      // console.log("Login response:", data);

      if (!res.ok || !data.success) {
        setError(data.message || "Login failed");
        showToast({
          message: data.message || "Login failed",
          type: "error",
        });
        return;
      }

      login(data.admin);

      showToast({
        message: data.message || "Welcome back!",
        type: "success",
      });
      navigate("/");
    } catch (err) {
      console.error("Error during login:", err);
      setError("Server error. Please try again.");
      showToast({
        message: "Server error. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#d1cbcb]">
      <div className="w-[900px] h-[520px] bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-2">
        
        <div className="bg-gradient-to-b from-[#2b2b2f] to-[#1f1f23] p-10 flex flex-col justify-center">
          <span className="text-gray-300 text-sm mb-8">Fit.it</span>

          <h2 className="text-white text-2xl font-semibold mb-6">
            Log in
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs text-gray-400">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@example.com"
                className="w-full mt-1 px-3 py-2 bg-[#2f2f34] 
                           border border-gray-700 rounded-md 
                           text-sm text-white outline-none
                           focus:border-pink-300"
                required
              />
            </div>

            <div>
              <label className="text-xs text-gray-400">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-[#2f2f34] 
                           border border-gray-700 rounded-md 
                           text-sm text-white outline-none
                           focus:border-pink-300"
                required
              />
            </div>

            {error && (
              <p className="text-xs text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2 rounded-md 
                         bg-[#e6a1a1] text-black 
                         font-medium text-sm
                         hover:bg-[#f0b4b4] transition
                         disabled:opacity-70"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <span className="text-xs text-gray-400 mt-6 cursor-pointer hover:text-pink-300">
            Forgot your password?
          </span>
        </div>

        <div className="relative">
          <img
            src="m2.jpg"
            alt="clothing"
            className="w-full h-full object-cover"
          />
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
