import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../dashboard/Sidebar";
import { getSellerOrders } from "../../../../api/order";
import { useNavigate } from "react-router-dom";
import socket from "../../../../socket/socket";
import toast from "react-hot-toast";

const statusColor = {
  pending: "bg-yellow-500/20 text-yellow-400",
  shipped: "bg-blue-500/20 text-blue-400",
  delivered: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
};

const normalizeStatus = (status) => status?.toLowerCase();

/* ================= STATUS TABS ================= */

const StatusTabs = ({ activeStatus, setActiveStatus, groupedOrders }) => {
  const tabs = [
    { key: "pending", label: "Pending" },
    { key: "shipped", label: "Shipped" },
    { key: "delivered", label: "Delivered" },
    { key: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="w-full overflow-hidden mb-6">
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveStatus(tab.key)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 whitespace-nowrap transition ${
              activeStatus === tab.key
                ? "bg-white text-black"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            {tab.label}

            <span className="px-2 py-0.5 rounded-full text-xs bg-black/20">
              {groupedOrders[tab.key].length}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

/* ================= ORDERS TABLE ================= */

const OrdersTable = ({ orders }) => {
  const navigate = useNavigate();

  if (orders.length === 0) {
    return (
      <div className="text-center text-white/60 py-20">
        No orders in this stage
      </div>
    );
  }

  return (
    <>
      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white/5 border border-white/10 rounded-2xl overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-white/10 text-white/70">
            <tr>
              <th className="px-4 py-3 text-left">Order</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Address</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => {
              const customerName =
                order.consumer?.displayName ||
                order.consumer?.fullName ||
                "Guest User";

              const address = order.shippingAddress
                ? `${order.shippingAddress.street || ""} ${
                    order.shippingAddress.city || ""
                  }`
                : "Address not available";

              return (
                <tr
                  key={order._id}
                  onClick={() =>
                    navigate(`/partner/orders/${order._id}`)
                  }
                  className="border-t border-white/10 hover:bg-white/10 cursor-pointer transition"
                >
                  <td className="px-4 py-3 font-medium">
                    #{order._id.slice(-6)}
                  </td>

                  <td className="px-4 py-3">
                    <div>{customerName}</div>
                    <div className="text-xs text-white/50">
                      {order.consumer?.email}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-white/70">
                    {address}
                  </td>

                  <td className="px-4 py-3">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3 font-semibold">
                    ₹{order.totalAmount}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusColor[
                          normalizeStatus(order.OrderStatus)
                        ]
                      }`}
                    >
                      {order.OrderStatus}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            onClick={() =>
              navigate(`/partner/orders/${order._id}`)
            }
            className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 cursor-pointer hover:bg-white/10 transition"
          >
            <div className="flex justify-between">
              <span className="font-semibold">
                #{order._id.slice(-6)}
              </span>

              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  statusColor[
                    normalizeStatus(order.OrderStatus)
                  ]
                }`}
              >
                {order.OrderStatus}
              </span>
            </div>

            <div className="text-sm text-white/70">
              {order.consumer?.displayName}
            </div>

            <div className="flex justify-between text-sm">
              <span>
                {new Date(order.createdAt).toLocaleDateString()}
              </span>

              <span className="font-semibold">
                ₹{order.totalAmount}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

/* ================= MAIN COMPONENT ================= */

const Orders = ({ sellerId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState("pending");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await getSellerOrders(sellerId);
      setOrders(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= SOCKET LISTENERS ================= */

  useEffect(() => {
    if (!sellerId) return;

    socket.on("new-order", (order) => {
      if (order.seller === sellerId) {
        setOrders((prev) => [order, ...prev]);

        toast.success("🛒 New order received!");
      }
    });

    socket.on("order-status-updated", (updatedOrder) => {
      setOrders((prev) =>
        prev.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );

      toast("📦 Order status updated");
    });

    return () => {
      socket.off("new-order");
      socket.off("order-status-updated");
    };
  }, [sellerId]);

  /* ================= FETCH ORDERS ================= */

  useEffect(() => {
    if (!sellerId) return;
    fetchOrders();
  }, [sellerId]);

  const groupedOrders = {
    pending: orders.filter(
      (o) => normalizeStatus(o.OrderStatus) === "pending"
    ),
    shipped: orders.filter(
      (o) => normalizeStatus(o.OrderStatus) === "shipped"
    ),
    delivered: orders.filter(
      (o) => normalizeStatus(o.OrderStatus) === "delivered"
    ),
    cancelled: orders.filter(
      (o) => normalizeStatus(o.OrderStatus) === "cancelled"
    ),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex overflow-x-hidden">
      <Sidebar />

      <div className="flex-1 px-4 md:px-6 py-8 overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <h1 className="text-2xl font-semibold mb-6">
            Orders
          </h1>

          <StatusTabs
            activeStatus={activeStatus}
            setActiveStatus={setActiveStatus}
            groupedOrders={groupedOrders}
          />

          <OrdersTable orders={groupedOrders[activeStatus]} />
        </motion.div>
      </div>
    </div>
  );
};

export default Orders;