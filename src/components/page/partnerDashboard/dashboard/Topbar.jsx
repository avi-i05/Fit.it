const Topbar = () => {
  return (
    <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <h1 className="text-white font-semibold">Partner Dashboard</h1>

      <div className="flex items-center gap-4">
        <span className="text-white/60 text-sm">Welcome back</span>
        <div className="w-8 h-8 rounded-full bg-white/20" />
      </div>
    </div>
  );
};

export default Topbar;