import { LayoutDashboard, ShoppingBag, Wallet, User } from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/partner/dashboard" },
    { label: "Orders", icon: ShoppingBag, path: "/partner/orders" },
    { label: "Products", icon: Wallet, path: "/partner/products" },
    { label: "Profile", icon: User, path: "/partner/profile" },
  ];

  return (
    <aside className="w-64 bg-black/60 backdrop-blur-xl border-r border-white/10 hidden md:block min-h-screen">
      <nav className="p-4 space-y-2">
        {menuItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 w-full px-4 py-3 rounded-xl transition
               ${
                 isActive
                   ? "bg-white text-black font-semibold"
                   : "text-white/70 hover:text-white hover:bg-white/10"
               }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;