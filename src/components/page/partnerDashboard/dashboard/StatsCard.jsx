const StatsCard = ({ title, value, subtitle }) => {
  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
      <p className="text-white/60 text-sm">{title}</p>
      <h2 className="text-3xl font-bold text-white mt-2">{value}</h2>
      <p className="text-white/40 text-sm mt-1">{subtitle}</p>
    </div>
  );
};

export default StatsCard;