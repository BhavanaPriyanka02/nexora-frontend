import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const token = res.data.access_token;

      // Save token
      localStorage.setItem("token", token);

      // Decode JWT payload
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role;

      // Save role
      localStorage.setItem("role", role);

      // Trigger UI re-render (for navbar/admin links)
      window.dispatchEvent(new Event("storage"));

      toast.success("Login successful");

      // Redirect based on role
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }

    } catch (err) {
      console.error(err);
      toast.error("Invalid credentials");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "70vh"
      }}
    >
      <div
        style={{
          background: "#ffffff",
          padding: "32px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          width: "100%",
          maxWidth: "400px"
        }}
      >
        <h1
          style={{
            fontSize: "26px",
            fontWeight: "600",
            marginBottom: "24px",
            color: "#111827"
          }}
        >
          Login
        </h1>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "14px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb"
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "20px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb"
            }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "500",
              cursor: "pointer"
            }}
          >
            Login
          </button>
        </form>

        <p
          style={{
            marginTop: "18px",
            fontSize: "14px",
            color: "#6b7280"
          }}
        >
          Don’t have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "#2563eb",
              fontWeight: "500",
              textDecoration: "none"
            }}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;