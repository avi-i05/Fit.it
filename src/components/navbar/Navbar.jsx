import { useState, useContext } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import AuthContext from "../../context/Auth/authcontext";
import { useNavigate } from "react-router-dom";
import { logout } from "../../api/auth";

const navContainer = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.08,
    },
  },
};

const navItem = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
};

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const { isAuthenticated, user, logoutContext } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
    logoutContext();
    navigate("/login");
  };
  // console.log(user);

  const guestLinks = ["Features", "Partners", "Pricing", "Contact"];

  const authLinks = [
    { label: "Dashboard", path: "/partner/dashboard" },
    { label: "Products", path: "/partner/products" },
    { label: "Orders", path: "/partner/orders" },
    { label: "Profile", path: "/partner/profile" },
  ];

  return (
    <motion.header
      variants={navContainer}
      initial="hidden"
      animate="visible"
      className="fixed top-0 left-0 w-full z-50"
    >
      <div className="backdrop-blur-xl bg-black/50 border-b border-white/10">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          {/* LOGO */}
          <motion.div variants={navItem} className="flex items-center gap-3">
            <img src="/lg.png" alt="Fit.it Logo" className="h-10 w-auto" />
          </motion.div>

          {/* CENTER NAV LINKS */}
          <nav className="hidden md:flex items-center gap-10">
            {!isAuthenticated
              ? guestLinks.map((item) => (
                  <motion.a
                    key={item}
                    variants={navItem}
                    href={`#${item.toLowerCase()}`}
                    className="text-white/70 hover:text-white transition"
                  >
                    {item}
                  </motion.a>
                ))
              : authLinks.map((item) => (
                  <motion.button
                    key={item.label}
                    variants={navItem}
                    onClick={() => navigate(item.path)}
                    className="text-white/70 hover:text-white transition"
                  >
                    {item.label}
                  </motion.button>
                ))}
          </nav>

          {/* RIGHT ACTIONS */}
          <motion.div
            variants={navItem}
            className="hidden md:flex items-center gap-4"
          >
            {!isAuthenticated ? (
              <>
                <a
                  href="/login"
                  className="px-5 py-2.5 rounded-xl font-medium text-white/80 border border-white/20 hover:bg-white/10 transition"
                >
                  Login
                </a>

                <a
                  href="/register"
                  className="px-6 py-2.5 rounded-xl font-semibold bg-white text-black hover:bg-white/90 transition shadow-md"
                >
                  Apply Now
                </a>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 text-white">
                  <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-semibold overflow-hidden">
                    {user?.ownerImage ? (
                      <img
                        src={user?.ownerImage}
                        alt="Owner"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user?.brandName?.charAt(0).toUpperCase() || "U"
                    )}
                  </div>
                  <span className="text-sm">
                    {user?.brandName || "Partner"}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl border border-white/20 text-white/80 hover:bg-white/10 transition"
                >
                  <LogOut size={18} />
                </button>
              </>
            )}
          </motion.div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden backdrop-blur-xl bg-black/80 border-b border-white/10"
        >
          <div className="flex flex-col px-6 py-6 gap-5">
            {!isAuthenticated
              ? guestLinks.map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-white/80"
                  >
                    {item}
                  </a>
                ))
              : authLinks.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      navigate(item.path);
                      setOpen(false);
                    }}
                    className="text-left text-white/80"
                  >
                    {item.label}
                  </button>
                ))}

            {!isAuthenticated ? (
              <>
                <a
                  href="/login"
                  className="mt-4 border border-white/20 text-white/80 px-6 py-3 rounded-xl font-medium text-center hover:bg-white/10 transition"
                >
                  Login
                </a>

                <a
                  href="/register"
                  className="bg-white text-black px-6 py-3 rounded-xl font-semibold text-center hover:bg-white/90 transition"
                >
                  Apply Now
                </a>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 text-white">
                  <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-semibold">
                    {user?.brandName?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span>{user?.brandName || "Partner"}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="mt-4 border border-white/20 text-white/80 px-6 py-3 rounded-xl font-medium text-center hover:bg-white/10 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Navbar;
