import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../dashboard/Sidebar";
import { getOrderById, updateOrderStatus } from "../../../../api/order";

const normalizeStatus = (status) => status?.toLowerCase();

const statusColor = {
  pending: "bg-yellow-500/20 text-yellow-400",
  shipped: "bg-blue-500/20 text-blue-400",
  delivered: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
};

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    try {
      const { data } = await getOrderById(orderId);
      setOrder(data?.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkShipped = async () => {
    try {
      setUpdating(true);
      await updateOrderStatus(orderId, "shipped");

      setOrder((prev) => ({
        ...prev,
        OrderStatus: "Shipped",
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to update order");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (!orderId) return;
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Order not found
      </div>
    );
  }

  const customerName =
    order.consumer?.displayName || order.consumer?.fullName || "Guest User";

  const customerEmail = order.consumer?.email || "Not available";

  const address = order.shippingAddress
    ? `${order.shippingAddress.street || ""} ${order.shippingAddress.city || ""} ${order.shippingAddress.state || ""}`
    : "Address not available";

  const status = normalizeStatus(order.OrderStatus);

  return (
    <div className="min-h-screen bg-black text-white flex pt-20">
      <Sidebar />

      <div className="flex-1 px-4 md:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          <button
            onClick={() => navigate("/partner/orders")}
            className="mb-6 text-sm text-white/60 hover:text-white"
          >
            ← Back
          </button>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <h1 className="text-2xl font-semibold">
                Order #{order._id.slice(-6)}
              </h1>

              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statusColor[status] || "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {order.OrderStatus}
                </span>

                {status === "pending" && (
                  <button
                    onClick={handleMarkShipped}
                    disabled={updating}
                    className="px-4 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
                  >
                    {updating ? "Updating..." : "Mark as Shipped"}
                  </button>
                )}
              </div>
            </div>

            {/* Customer + Address */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-sm text-white/50 mb-2">
                  Customer Details
                </h2>
                <p>{customerName}</p>
                <p className="text-white/60 text-sm">{customerEmail}</p>
              </div>

              <div>
                <h2 className="text-sm text-white/50 mb-2">
                  Shipping Address
                </h2>
                <p className="text-white/70">{address}</p>
              </div>
            </div>

            {/* Items */}
            <div>
              <h2 className="text-sm text-white/50 mb-4">Items</h2>

              <div className="space-y-4">
                {order.items?.map((item, index) => {
                  const price = item.variant?.price || 0;
                  const subtotal = price * item.quantity;
                  const image =
                    item.variant?.images?.[0] ||
                    "https://via.placeholder.com/80";

                  return (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white/5 p-4 rounded-xl"
                    >
                      <div className="flex items-center gap-4">
                        
                        {/* Product Image */}
                        <img
                          src={image}
                          alt={item.product?.productName}
                          className="w-16 h-16 rounded-lg object-cover border border-white/10"
                        />

                        {/* Product Info */}
                        <div>
                          <p className="font-medium">
                            {item.product?.productName}
                          </p>

                          <p className="text-xs text-white/50">
                            Size: {item.variant?.size} | Color:{" "}
                            {item.variant?.color}
                          </p>

                          <p className="text-xs text-white/50">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-sm text-white/50">
                          ₹{price} × {item.quantity}
                        </p>

                        <p className="font-semibold text-lg">
                          ₹{subtotal}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center pt-4 border-t border-white/10">
              <span className="text-white/60">Total Amount</span>
              <span className="text-xl font-semibold">
                ₹{order.totalAmount}
              </span>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderDetails;