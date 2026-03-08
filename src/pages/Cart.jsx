import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const Cart = () => {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

 const handleCheckout = async () => {
  try {

    const orderData = {
      idempotency_key: Date.now().toString(),
      items: items.map(item => ({
        id: item.id,
        quantity: item.quantity
      }))
    };

    const response = await api.post("/orders/create", orderData);

    if (response.data.success) {

      toast.success(response.data.message);

      setItems([]);
      localStorage.removeItem("cart");

      setTimeout(() => {
        window.location.href = "/orders";
      }, 1200);

    }

  } catch (error) {

    console.error("Checkout failed", error);
    toast.error("Checkout failed");

  }
};

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Your Cart</h1>

      {items.length === 0 && <p>Cart is empty</p>}

      {items.map((item) => (
        <div
          key={item.id}
          style={{
            background: "white",
            padding: "15px",
            marginTop: "10px",
            borderRadius: "8px",
          }}
        >
          <p><strong>{item.name}</strong></p>
          <p>Price: ₹{item.price}</p>
          <p>Quantity: {item.quantity}</p>

          <button
            onClick={() => removeItem(item.id)}
            style={{
              marginTop: "10px",
              padding: "6px 10px",
              background: "#dc2626",
              color: "white",
              borderRadius: "6px"
            }}
          >
            Remove
          </button>
        </div>
      ))}

      {items.length > 0 && (
        <button
          onClick={handleCheckout}
          style={{
            marginTop: "20px",
            padding: "12px",
            background: "#16a34a",
            color: "white",
            borderRadius: "8px",
            width: "200px"
          }}
        >
          Checkout
        </button>
      )}
    </div>
  );
};

export default Cart;
