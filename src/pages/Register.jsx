import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const Register = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", {
        email,
        password
      });

      <toast className="success"></toast>("Registration successful! Please login.");
      navigate("/login");

    } catch (error) {
      console.error(error);
      toast.error("Registration failed");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Create Account</h2>

      <form onSubmit={handleRegister} style={{ marginTop: "20px" }}>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: "block", marginBottom: "15px", padding: "10px", width: "250px" }}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: "block", marginBottom: "15px", padding: "10px", width: "250px" }}
        />

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            background: "#2563eb",
            color: "white",
            borderRadius: "6px",
            border: "none"
          }}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;