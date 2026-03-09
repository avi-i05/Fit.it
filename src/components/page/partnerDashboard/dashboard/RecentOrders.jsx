const RecentOrders = () => {
  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
      <h3 className="text-white font-semibold mb-4">Recent Orders</h3>

      <div className="space-y-4">
        {["Oversized Hoodie", "Denim Jacket", "Cargo Pants"].map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between text-white/70"
          >
            <span>{item}</span>
            <span className="text-sm text-white/40">Delivered</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentOrders;