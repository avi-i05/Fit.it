import DashboardLayout from "./dashboard/DashboardLayout";
import Sidebar from "./dashboard/Sidebar";
import DashboardHome from "./dashboard/DashboardHome";

const PartnerDashboard = () => {
  return (
    <DashboardLayout >
      <Sidebar />
      <DashboardHome />
    </DashboardLayout>
  );
};

export default PartnerDashboard;