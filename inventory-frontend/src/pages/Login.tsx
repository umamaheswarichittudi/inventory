import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.user, res.data.token);
      if (res.data.user.role === "admin") navigate("/admin");
      else navigate("/products");
    } catch (err: any) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}> Welcome Back</h2>

        <input
          style={styles.input}
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button}>Login</button>

        
      </form>
    </div>
  );
}

// 🎨 Internal Styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, rgba(218, 221, 231, 1) 0%, #d8d0e0ff 100%)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    background: "white",
    padding: "2rem",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
    width: "350px",
    textAlign: "center",
    animation: "fadeIn 0.6s ease-in-out",
  },
  title: {
    marginBottom: "1.5rem",
    fontSize: "1.5rem",
    color: "#333",
    fontWeight: 600,
  },
  input: {
    width: "60%",
    padding: "12px 14px",
    margin: "0.5rem 0",
    border: "1px solid #ddd",
    borderRadius: "8px",
    outline: "none",
    fontSize: "0.95rem",
    transition: "all 0.3s ease",
  },
  button: {
    width: "60%",
    padding: "12px",
    marginTop: "1rem",
    background: "linear-gradient(90deg, #4f46e5, #3b82f6)",
    color: "white",
    fontWeight: 600,
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "transform 0.2s, background 0.3s",
  },
  helperText: {
    marginTop: "1rem",
    fontSize: "0.8rem",
    color: "#777",
  },
};
