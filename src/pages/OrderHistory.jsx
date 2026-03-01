import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) return;   // ❗ stop API call if no token

  api.get("/orders/my-orders")
    .then(res => setOrders(res.data.data))
    .catch(err => console.error("Error fetching orders", err));
}, []);


const handleCancel = async (orderId) => {
  try {
    const res = await api.put(`/orders/${orderId}/cancel`);

    if (res.data.success) {
      toat.success(res.data.message);

      // refresh orders after cancel
      const updated = await api.get("/orders/my-orders");
      setOrders(updated.data.data);
    }

  } catch (error) {
    console.error("Cancel failed", error);
    toast.error("Cancel failed");
  }
};


  return (
  <div>
    <h1
      style={{
        fontSize: "26px",
        fontWeight: "600",
        marginBottom: "24px",
        color: "#111827"
      }}
    >
      My Orders
    </h1>

    {orders.length === 0 && <p>No orders yet</p>}

    {orders.map(order => (
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontWeight: "600" }}>Order #{order.id}</h3>

          <span
            style={{
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "500",
              backgroundColor:
                order.status === "pending"
                  ? "#fef3c7"
                  : order.status === "paid"
                  ? "#dbeafe"
                  : order.status === "shipped"
                  ? "#ede9fe"
                  : order.status === "delivered"
                  ? "#d1fae5"
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
                  : "#374151"
            }}
          >
            {order.status}
          </span>
        </div>

        <p style={{ marginTop: "10px", fontWeight: "500" }}>
          Total: ₹{order.total_price}
        </p>

        {order.status === "pending" && (
          <button
            onClick={() => handleCancel(order.id)}
            style={{
              marginTop: "12px",
              padding: "8px 14px",
              background: "#f59e0b",
              color: "white",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer"
            }}
          >
            Cancel Order
          </button>
        )}

        <h4 style={{ marginTop: "16px", marginBottom: "10px" }}>Items</h4>

        {order.items.map((item, index) => (
          <div
            key={index}
            style={{
              padding: "8px 0",
              borderBottom: "1px solid #f3f4f6"
            }}
          >
            <p style={{ fontWeight: "500" }}>{item.product_name}</p>
            <p style={{ fontSize: "14px", color: "#6b7280" }}>
              Quantity: {item.quantity} | ₹{item.price}
            </p>
          </div>
        ))}
      </div>
    ))}
  </div>
);
};

export default OrderHistory;
