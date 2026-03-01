import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const AdminOrders = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 🔥 NEW

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders/");
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching admin orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      const res = await api.put(`/orders/${orderId}/status/`, {
        status: status
      });

      if (res.data.success) {
        toast.success(res.data.message);
        fetchOrders();
      }

    } catch (error) {
      console.error("Status update failed", error);
      toast.error("Failed to update");
    }
  };

  // 🔥 FILTER LOGIC
  const filteredOrders = orders.filter(order => {
    if (filter === "active") {
      return order.status !== "cancelled" && order.status !== "delivered";
    }
    if (filter === "cancelled") {
      return order.status === "cancelled";
    }
    return true; // all
  });

  return (
    <div>
      <h1
        style={{
          fontSize: "28px",
          fontWeight: "600",
          marginBottom: "20px",
          color: "#111827"
        }}
      >
        Admin Orders
      </h1>

      {/* 🔥 FILTER TOGGLE */}
      <div style={{ marginBottom: "24px", display: "flex", gap: "12px" }}>
        {["all", "active", "cancelled"].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              background:
                filter === type ? "#2563eb" : "#e5e7eb",
              color:
                filter === type ? "white" : "#374151",
              fontWeight: "500",
              textTransform: "capitalize",
              transition: "0.2s ease"
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {loading && <p>Loading Orders...</p>}
      {!loading && filteredOrders.length === 0 && <p>No Orders Found</p>}

      {!loading &&
        filteredOrders.map(order => (
          <div
            key={order.id}
            style={{
              background: "#ffffff",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
            }}
          >
            {/* Header Row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <h3 style={{ fontWeight: "600" }}>
                Order #{order.id}
              </h3>

              {/* Status Badge */}
              <span
                style={{
                  padding: "4px 12px",
                  fontSize: "12px",
                  fontWeight: "500",
                  borderRadius: "20px",
                  backgroundColor:
                    order.status === "pending"
                      ? "#fef3c7"
                      : order.status === "paid"
                      ? "#dbeafe"
                      : order.status === "shipped"
                      ? "#ede9fe"
                      : order.status === "delivered"
                      ? "#d1fae5"
                      : order.status === "cancelled"
                      ? "#fee2e2"
                      : "#f3f4f6",
                  color:
                    order.status === "pending"
                      ? "#92400e"
                      : order.status === "paid"
                      ? "#1e40af"
                      : order.status === "shipped"
                      ? "#5b21b6"
                      : order.status === "delivered"
                      ? "#065f46"
                      : order.status === "cancelled"
                      ? "#991b1b"
                      : "#374151"
                }}
              >
                {order.status}
              </span>
            </div>

            <p style={{ marginTop: "10px", fontWeight: "500" }}>
              Total: ₹{order.total_price}
            </p>

            {/* Action Buttons */}
            <div style={{ marginTop: "14px" }}>
              {order.status === "pending" && (
                <button
                  onClick={() => updateStatus(order.id, "paid")}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#2563eb",
                    color: "white",
                    cursor: "pointer"
                  }}
                >
                  Mark as Paid
                </button>
              )}

              {order.status === "paid" && (
                <button
                  onClick={() => updateStatus(order.id, "shipped")}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#7c3aed",
                    color: "white",
                    cursor: "pointer"
                  }}
                >
                  Mark as Shipped
                </button>
              )}

              {order.status === "shipped" && (
                <button
                  onClick={() => updateStatus(order.id, "delivered")}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#16a34a",
                    color: "white",
                    cursor: "pointer"
                  }}
                >
                  Mark as Delivered
                </button>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default AdminOrders;