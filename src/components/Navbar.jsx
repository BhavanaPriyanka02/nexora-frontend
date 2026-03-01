import { Link } from "react-router-dom";

const Navbar = ({ cartCount }) => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const linkStyle = {
    textDecoration: "none",
    color: "#374151",
    fontWeight: "500"
  };

  return (
    <nav
      style={{
        background: "#ffffff",
        padding: "16px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        position: "sticky",
        top: 0,
        zIndex: 1000
      }}
    >
      <h2
        style={{
          color: "#2563eb",
          fontWeight: "600",
          fontSize: "20px"
        }}
      >
        ShopEase
      </h2>

      <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
        <Link to="/" style={linkStyle}>Products</Link>

        {/* Cart Badge */}
        <div style={{ position: "relative" }}>
          <Link to="/cart" style={linkStyle}>Cart</Link>

          {cartCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-8px",
                right: "-12px",
                backgroundColor: "#2563eb",
                color: "white",
                fontSize: "11px",
                fontWeight: "600",
                padding: "4px 8px",
                borderRadius: "50%"
              }}
            >
              {cartCount}
            </span>
          )}
        </div>

        <Link to="/orders" style={linkStyle}>My Orders</Link>

        {role === "admin" && (
          <>
            <Link to="/admin" style={linkStyle}>Admin Orders</Link>
            <Link to="/admin/products" style={linkStyle}>Manage Products</Link>
          </>
        )}

        {!token ? (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>

            <Link
              to="/register"
              style={{
                background: "#2563eb",
                color: "white",
                padding: "8px 14px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "500"
              }}
            >
              Register
            </Link>
          </>
        ) : (
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            style={{
              background: "#ef4444",
              color: "white",
              border: "none",
              padding: "8px 14px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;