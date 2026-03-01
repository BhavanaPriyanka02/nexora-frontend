import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const AdminProducts = () => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add form states
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");

  // Edit states
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products/");
      setProducts(res.data.data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    if (!name || !price || !stock || !imageUrl || !category) {
      toast.error("All fields required");
      return;
    }

    try {
      await api.post("/products/", {
        name,
        price: Number(price),
        stock: Number(stock),
        image_url: imageUrl,
        category
      });

      toast.success("Product Added");
      fetchProducts();

      setName("");
      setPrice("");
      setStock("");
      setImageUrl("");
      setCategory("");

    } catch (err) {
      toast.error("Add failed");
      console.log(err.response?.data);
    }
  };

  const startEdit = (product) => {
    setEditId(product.id);
    setEditData(product);
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/products/${editId}`, {
        ...editData,
        price: Number(editData.price),
        stock: Number(editData.stock)
      });

      toast.success("Updated Successfully");
      setEditId(null);
      fetchProducts();

    } catch (err) {
      toast.error("Update failed");
      console.log(err.response?.data);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}/`);
      fetchProducts();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "8px",
  border: "1px solid #e5e7eb"
};

const primaryButton = {
  width: "100%",
  padding: "10px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontWeight: "500",
  cursor: "pointer"
};

const primaryButtonSmall = {
  padding: "6px 12px",
  background: "#2563eb",
  color: "white",
  borderRadius: "8px",
  border: "none",
  marginRight: "8px",
  cursor: "pointer",
  fontSize: "13px"
};

const secondaryButtonSmall = {
  padding: "6px 12px",
  background: "#d1d5db",
  color: "#111827",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontSize: "13px"
};

const dangerButtonSmall = {
  padding: "6px 12px",
  background: "#ef4444",
  color: "white",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontSize: "13px"
};

  return (
  <div>
    <h1
      style={{
        fontSize: "28px",
        fontWeight: "600",
        marginBottom: "30px",
        color: "#111827"
      }}
    >
      Admin Product Management
    </h1>

    {/* ADD PRODUCT CARD */}
    <div
      style={{
        background: "#ffffff",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        marginBottom: "40px",
        maxWidth: "500px"
      }}
    >
      <h3 style={{ marginBottom: "16px", fontWeight: "600" }}>
        Add Product
      </h3>

      <input
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        style={inputStyle}
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={e => setPrice(e.target.value)}
        style={inputStyle}
      />

      <input
        type="number"
        placeholder="Stock"
        value={stock}
        onChange={e => setStock(e.target.value)}
        style={inputStyle}
      />

      <input
        placeholder="Image URL"
        value={imageUrl}
        onChange={e => setImageUrl(e.target.value)}
        style={inputStyle}
      />

      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
        style={inputStyle}
      >
        <option value="">Select Category</option>
        <option value="electronics">Electronics</option>
        <option value="fashion">Fashion</option>
        <option value="accessories">Accessories</option>
        <option value="home">Home</option>
        <option value="beauty">Beauty</option>
      </select>

      <button
        onClick={handleAddProduct}
        style={primaryButton}
      >
        Add Product
      </button>
    </div>

    {loading && <p>Loading...</p>}

    {!loading && products.map(product => (
      <div
        key={product.id}
        style={{
          background: "#ffffff",
          padding: "20px",
          marginBottom: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
        }}
      >
        {editId === product.id ? (
          <>
            <input
              value={editData.name}
              onChange={e => setEditData({...editData, name: e.target.value})}
              style={inputStyle}
            />

            <input
              type="number"
              value={editData.price}
              onChange={e => setEditData({...editData, price: e.target.value})}
              style={inputStyle}
            />

            <input
              type="number"
              value={editData.stock}
              onChange={e => setEditData({...editData, stock: e.target.value})}
              style={inputStyle}
            />

            <input
              value={editData.image_url}
              onChange={e => setEditData({...editData, image_url: e.target.value})}
              style={inputStyle}
            />

            <select
              value={editData.category}
              onChange={e => setEditData({...editData, category: e.target.value})}
              style={inputStyle}
            >
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="accessories">Accessories</option>
              <option value="home">Home</option>
              <option value="beauty">Beauty</option>
            </select>

            <div style={{ marginTop: "12px" }}>
              <button onClick={handleUpdate} style={primaryButtonSmall}>
                Save
              </button>

              <button
                onClick={() => setEditId(null)}
                style={secondaryButtonSmall}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontWeight: "600" }}>
                {product.name}
              </h3>

              <span
                style={{
                  padding: "4px 10px",
                  fontSize: "12px",
                  borderRadius: "20px",
                  backgroundColor: "#e0f2fe",
                  color: "#0369a1",
                  fontWeight: "500"
                }}
              >
                {product.category}
              </span>
            </div>

            <p style={{ color: "#2563eb", fontWeight: "600", marginTop: "6px" }}>
              ₹{product.price}
            </p>

            <p style={{ color: "#16a34a", marginBottom: "12px" }}>
              Stock: {product.stock}
            </p>

            <button
              onClick={() => startEdit(product)}
              style={primaryButtonSmall}
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(product.id)}
              style={dangerButtonSmall}
            >
              Delete
            </button>
          </>
        )}
      </div>
    ))}
  </div>
);
};

export default AdminProducts;