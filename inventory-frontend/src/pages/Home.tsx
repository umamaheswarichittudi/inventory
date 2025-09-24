import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #dbeafe, #e9d5ff, #c7d2fe)",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          padding: "40px",
          width: "400px",
          textAlign: "center",
        }}
      >
        {/* Title */}
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "600",
            color: "#1f2937",
            marginBottom: "20px",
          }}
        >
          Welcome
        </h2>

        

        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Link
            to="/login"
            style={{
              background: "linear-gradient(to right, #3b82f6, #6366f1)",
              color: "white",
              padding: "10px",
              borderRadius: "8px",
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              transition: "0.3s",
              textAlign: "center",
            }}
          >
            Login
          </Link>
          <Link
            to="/signup"
            style={{
              background: "linear-gradient(to right, #3b82f6, #6366f1",
              color: "white",
              padding: "10px",
              borderRadius: "8px",
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              transition: "0.3s",
              textAlign: "center",
            }}
          >
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
}
