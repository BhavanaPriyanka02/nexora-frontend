import { useEffect, useState } from "react";
import { getOrders } from "../api/orderApi";
import { updateOrderStatus } from "../api/orderApi";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrders().then((res) => {
      setOrders(res.data);
    });
  }, []);

  const handlePayment = async (orderId) => {
  try {
    await updateOrderStatus(orderId, "PAID");

    // Refresh orders after payment
    const res = await getOrders();
    setOrders(res.data);
  } catch (error) {
    console.error("Payment failed", error);
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
      Your Orders
    </h1>

    {orders.length === 0 && <p>No orders yet</p>}

    {orders.map((order, index) => (
      <div
        key={index}
        style={{
          background: "#ffffff",
          padding: "20px",
          marginBottom: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontWeight: "600" }}>
            Order ID: {order.order_id}
          </p>

          <span
            style={{
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "500",
              backgroundColor:
                order.status === "CREATED"
                  ? "#fef3c7"
                  : order.status === "PAID"
                  ? "#dbeafe"
                  : "#d1fae5",
              color:
                order.status === "CREATED"
                  ? "#92400e"
                  : order.status === "PAID"
                  ? "#1e40af"
                  : "#065f46"
            }}
          >
            {order.status}
          </span>
        </div>

        {order.status === "CREATED" && (
          <button
            onClick={() => handlePayment(order.order_id)}
            style={{
              marginTop: "12px",
              padding: "8px 14px",
              background: "#2563eb",
              color: "white",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer"
            }}
          >
            Pay Now
          </button>
        )}

        <div style={{ marginTop: "14px" }}>
          <p style={{ fontWeight: "500", marginBottom: "6px" }}>Items</p>

          {order.items.map((item, i) => (
            <div
              key={i}
              style={{
                padding: "6px 0",
                borderBottom: "1px solid #f3f4f6"
              }}
            >
              Product ID: {item.product_id} — Qty: {item.quantity}
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);
};

export default Orders;
