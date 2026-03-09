import StatsCard from "./StatsCard";
import RecentOrders from "./RecentOrders";

const DashboardHome = () => {
  return (
    <div className="flex-1 flex flex-col">

      <main className="p-6 space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          <StatsCard
            title="Total Earnings"
            value="₹0"
            subtitle="Last 30 days"
          />
          <StatsCard
            title="Orders Completed"
            value="0"
            subtitle="This month"
          />
          <StatsCard
            title="Avg Delivery Time"
            value="?? min"
            subtitle="Quick commerce"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <RecentOrders />
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">
              Performance Insight
            </h3>
            <p className="text-white/60">
              Your fashion products are performing better during evenings.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardHome;