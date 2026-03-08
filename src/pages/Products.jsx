import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const Products = ({ setCartCount }) => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");

      // 🔥 IMPORTANT FIX
      const productData =
        res.data?.data?.items || res.data || [];

      setProducts(productData);

      console.log("Loaded products 👉", productData);

    } catch (err) {
      console.error("Products API error 👉", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = (product) => {
  const existing = JSON.parse(localStorage.getItem("cart")) || [];

  const found = existing.find((item) => item.id === product.id);

  let updated;

  if (found) {
    updated = existing.map((item) =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  } else {
    updated = [...existing, { ...product, quantity: 1 }];
  }

  localStorage.setItem("cart", JSON.stringify(updated));

  // 🔥 Update badge instantly
  const total = updated.reduce((sum, item) => sum + item.quantity, 0);
  setCartCount(total);

  toast.success("Added to cart!");
};

  const filteredProducts = products.filter((product) => {

  const category = product.category?.trim().toLowerCase() || "";
  const selected = selectedCategory?.trim().toLowerCase() || "";

  const name = product.name?.trim().toLowerCase() || "";
  const search = searchTerm?.trim().toLowerCase() || "";

  const matchesCategory =
    selected === "all" || category === selected;

  const matchesSearch =
    name.includes(search);

  return matchesCategory && matchesSearch;
});

  return (
  <div>
    <h1
      style={{
        fontSize: "28px",
        fontWeight: "600",
        marginBottom: "24px",
        color: "#111827"
      }}
    >
      Products
    </h1>

    {/* CATEGORY + SEARCH */}
    <div
      style={{
        display: "flex",
        gap: "16px",
        marginBottom: "30px",
        alignItems: "center"
      }}
    >
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
          background: "white"
        }}
      >
        <option value="all">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="fashion">Fashion</option>
        <option value="accessories">Accessories</option>
        <option value="home">Home</option>
        <option value="beauty">Beauty</option>
      </select>

      <input
        type="text"
        placeholder="Search product..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          flex: 1,
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #e5e7eb"
        }}
      />
    </div>

    {loading && <p>Loading Products...</p>}

    {!loading && (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "24px"
        }}
      >
        {filteredProducts.length === 0 && <p>No products found.</p>}

        {filteredProducts.map((p) => (
          <div
            key={p.id}
            style={{
              background: "#ffffff",
              padding: "18px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              transition: "all 0.25s ease",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
            }}
          >
            <img
              src={p.image_url}
              alt={p.name}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "12px"
              }}
            />

            <h3
              style={{
                fontSize: "16px",
                fontWeight: "600",
                marginBottom: "6px",
                color: "#111827"
              }}
            >
              {p.name}
            </h3>

            <p
              style={{
                fontWeight: "600",
                color: "#2563eb",
                marginBottom: "8px"
              }}
            >
              ₹{p.price}
            </p>

            <p
              style={{
                fontSize: "14px",
                marginBottom: "12px",
                color: p.stock > 0 ? "#16a34a" : "#dc2626"
              }}
            >
              {p.stock > 0
                ? `In Stock (${p.stock})`
                : "Out of Stock"}
            </p>

            <button
              disabled={p.stock === 0}
              onClick={() => addToCart(p)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "none",
                background: p.stock === 0 ? "#d1d5db" : "#2563eb",
                color: "white",
                fontWeight: "500",
                cursor: p.stock === 0 ? "not-allowed" : "pointer"
              }}
            >
              {p.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
);
};

export default Products;
