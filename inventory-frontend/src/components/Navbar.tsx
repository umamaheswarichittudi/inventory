import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={styles.nav}>
      <h1 style={styles.brand}>Inventory App</h1>

      <div style={styles.links}>
        {user?.role === "user" && (
          <>
            <Link to="/products" style={styles.link}>
              Products
            </Link>
            
          </>
        )}

        {user?.role === "admin" && (
          <>
            <Link to="/admin" style={styles.link}>
              Admin Dashboard
            </Link>
          </>
        )}

        {!user ? (
          <>
            <Link to="/login" style={styles.link}>
              Login
            </Link>
            <Link to="/signup" style={styles.link}>
              Signup
            </Link>
          </>
        ) : (
          <button onClick={logout} style={styles.logoutBtn}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

// 🎨 Internal Styles
const styles: { [key: string]: React.CSSProperties } = {
  nav: {
    background: "linear-gradient(90deg, #2563eb, #1e40af)",
    color: "white",
    padding: "12px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  brand: {
    fontWeight: 700,
    fontSize: "1.2rem",
    letterSpacing: "0.5px",
  },
  links: {
    display: "flex",
    gap: "18px",
    alignItems: "center",
  },
  link: {
    textDecoration: "none",
    color: "white",
    fontWeight: 500,
    fontSize: "0.95rem",
    transition: "color 0.2s, transform 0.2s",
  },
  logoutBtn: {
    background: "#dc2626",
    border: "none",
    borderRadius: "6px",
    padding: "6px 12px",
    cursor: "pointer",
    color: "white",
    fontWeight: 600,
    transition: "background 0.3s ease, transform 0.2s ease",
  },
};
