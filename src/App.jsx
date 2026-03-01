import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import OrderHistory from "./pages/OrderHistory";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";
import Register from "./pages/Register";

function App() {
  const [cartCount, setCartCount] = useState(0);
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Load cart count
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(total);
  }, []);

  // Listen for localStorage updates (login/logout)
  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem("role"));
      setToken(localStorage.getItem("token"));

      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const total = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb"
      }}
    >
      <Navbar cartCount={cartCount} />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "24px"
        }}
      >
        <Routes>
          <Route
            path="/"
            element={<Products setCartCount={setCartCount} />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/orders"
            element={
              token ? <OrderHistory /> : <h1>Please Login First</h1>
            }
          />

          <Route path="/admin" element={<Admin />}>
            <Route
              index
              element={
                role === "admin"
                  ? <AdminOrders />
                  : <h1>Access Denied</h1>
              }
            />
            <Route
              path="orders"
              element={
                role === "admin"
                  ? <AdminOrders />
                  : <h1>Access Denied</h1>
              }
            />
            <Route
              path="products"
              element={
                role === "admin"
                  ? <AdminProducts />
                  : <h1>Access Denied</h1>
              }
            />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;


