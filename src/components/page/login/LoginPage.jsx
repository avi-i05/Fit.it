import { motion } from "framer-motion";
import { login } from "../../../api/auth";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../../../context/Auth/authcontext";
// import ToastContext from "../../../context/ToastContext";

const Login = () => {
  const navigate = useNavigate();
  // const { showToast } = useContext(ToastContext);
const { loginContext } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      // showToast({
      //   message: "Please fill in all fields",
      //   type: "error",
      // });
      setLoading(false);
      return;
    }

    try {
      const res = await login({ email, password });
      console.log(res);


      // backend sets cookie automatically
      loginContext(res.data.data.seller);

      // showToast({
      //   message: res.data.message || "Welcome back!",
      //   type: "success",
      // });

      navigate("/partner/dashboard"); // partner dashboard

    } catch (err) {
      const msg = err.res?.data?.message || err.message;

      setError(msg);
      // showToast({
      //   message: msg,
      //   type: "error",
      // });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-black">

      {/* LEFT — BRAND VISUAL */}
      <div
        className="hidden lg:flex flex-col justify-center px-16 relative bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1521334884684-d80222895322')",
        }}
      >
        <div className="absolute inset-0 bg-black/70" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-md"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Fashion. Delivered Fast.
          </h1>
          <p className="text-white/70 text-lg">
            Discover trend-driven clothing and get it delivered in minutes —
            not days.
          </p>
        </motion.div>
      </div>

      {/* RIGHT — LOGIN FORM */}
      <div className="flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md backdrop-blur-xl bg-black/50 border border-white/10 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-white/60 mb-6">
            Login to manage your store instantly
          </p>

          <form className="space-y-5" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
            />

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-white/90 transition disabled:opacity-70"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-white/60 text-sm mt-6 text-center">
            New here?{" "}
            <a href="/register" className="text-white underline">
              Create an account
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;