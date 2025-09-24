import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/signup", { name, email, password });
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err: any) {
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>

        <input
          style={styles.input}
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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

        <button style={styles.button}>Signup</button>

        <p style={styles.helperText}>
          Already have an account? <a href="/login" style={styles.link}>Login</a>
        </p>
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
    background: "linear-gradient(135deg, #cdd3d1ff 0%, #f2faf8ff 100%)",
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
    width: "80%",
    padding: "12px 14px",
    margin: "0.5rem 0",
    border: "1px solid #ddd",
    borderRadius: "8px",
    outline: "none",
    fontSize: "0.95rem",
    transition: "all 0.3s ease",
  },
  button: {
    width: "80%",
    padding: "12px",
    marginTop: "1rem",
    background: "linear-gradient(to right, #3b82f6, #6366f1",
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
    fontSize: "0.85rem",
    color: "#555",
  },
  link: {
    color: "#059669",
    fontWeight: 600,
    textDecoration: "none",
  },
};
