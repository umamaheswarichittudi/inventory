import { useEffect, useState } from "react";
import API from "../api/api";
import { Product } from "../types/types";

type CartItem = {
  productId: number;
  name: string;
  quantity: number;
};

type Order = {
  id: number;
  created_at: string;
  items: { name: string; price: number; quantity: number }[];
  total?: number; // added
};

export default function UserDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  // Fetch products
  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get("/user/products");
      setProducts(res.data);
    } catch {
      setMessage(" Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user orders
  const loadOrders = async () => {
    try {
      const res = await API.get("/user/orders");
      const enriched = res.data.map((order: Order) => ({
        ...order,
        total: order.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      }));
      setOrders(enriched);
    } catch {
      setMessage(" Failed to load orders");
    }
  };

  // Add to cart
  const addToCart = (productId: number, name: string, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId, name, quantity }];
    });
    setMessage(`🛒 ${name} added to cart!`);
  };

  // Checkout → send order to backend
  const handleCheckout = async () => {
    try {
      await API.post("/user/orders", { items: cart });
      setMessage(" ✅ Order placed successfully!");
      setCart([]); // clear cart
      loadProducts(); // refresh stock
      loadOrders(); // refresh orders
      setActiveTab("orders"); // switch to orders tab
    } catch {
      setMessage(" ❌ Failed to place order");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>User Dashboard</h2>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tabBtn,
            background: activeTab === "products" ? "#2563eb" : "#e5e7eb",
            color: activeTab === "products" ? "#fff" : "#000",
          }}
          onClick={() => setActiveTab("products")}
        >
          🛒 Products
        </button>
        <button
          style={{
            ...styles.tabBtn,
            background: activeTab === "orders" ? "#2563eb" : "#e5e7eb",
            color: activeTab === "orders" ? "#fff" : "#000",
          }}
          onClick={() => setActiveTab("orders")}
        >
          📦 My Orders
        </button>
      </div>

      {message && <div style={styles.message}>{message}</div>}

      {activeTab === "products" ? (
        <>
          {loading ? (
            <p style={styles.empty}>Loading products...</p>
          ) : products.length === 0 ? (
            <p style={styles.empty}>No products available</p>
          ) : (
            <div style={styles.grid}>
              {products.map((p) => (
                <div key={p.id} style={styles.card}>
                  {p.image_url && (
                    <img src={p.image_url} alt={p.name} style={styles.image} />
                  )}

                  <h3 style={styles.productName}>{p.name}</h3>
                  <p style={styles.category}>{p.category}</p>
                  <p style={styles.price}>₹ {p.price}</p>
                  <p
                    style={{
                      ...styles.stock,
                      color:
                        p.stock > 5
                          ? "#16a34a"
                          : p.stock > 0
                          ? "#ca8a04"
                          : "#dc2626",
                    }}
                  >
                    Stock: {p.stock}
                  </p>

                  <button
                    style={{
                      ...styles.button,
                      background: p.stock < 1 ? "#e5e7eb" : "#2563eb",
                      color: p.stock < 1 ? "#6b7280" : "#fff",
                      cursor: p.stock < 1 ? "not-allowed" : "pointer",
                    }}
                    onClick={() => addToCart(p.id, p.name, 1)}
                    disabled={p.stock < 1}
                  >
                    {p.stock < 1 ? "Out of stock" : "Add to Cart"}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Cart Section */}
          {cart.length > 0 && (
            <div style={styles.cartBox}>
              <h3 style={styles.cartTitle}>🛍️ Your Cart</h3>
              <ul style={styles.cartList}>
                {cart.map((item) => (
                  <li key={item.productId} style={styles.cartItem}>
                    {item.name} × {item.quantity}
                  </li>
                ))}
              </ul>
              <button style={styles.checkoutBtn} onClick={handleCheckout}>
                ✅ Checkout
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          {orders.length === 0 ? (
            <p style={styles.empty}>No orders placed yet</p>
          ) : (
            <div>
              {orders.map((order) => (
                <div key={order.id} style={styles.orderCard}>
                  <h4> Order #{order.id}</h4>
                  <p>{new Date(order.created_at).toLocaleString()}</p>
                  <ul>
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        {item.name} × {item.quantity} — ₹
                        {item.price * item.quantity}
                      </li>
                    ))}
                  </ul>
                  <p style={styles.orderTotal}>
                    <b>Total:</b> ₹ {order.total}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// 🎨 Styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "2rem",
    minHeight: "100vh",
    background: "#f9fafb",
  },
  title: {
    fontSize: "2rem",
    fontWeight: 700,
    marginBottom: "1.5rem",
    textAlign: "center",
    color: "#1f2937",
  },
  message: {
    margin: "0 auto 1rem auto",
    textAlign: "center",
    fontSize: "0.95rem",
    fontWeight: 500,
    color: "#1d4ed8",
    background: "#dbeafe",
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    maxWidth: "400px",
  },
  tabs: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "1.5rem",
    gap: "1rem",
  },
  tabBtn: {
    padding: "0.6rem 1.2rem",
    border: "none",
    borderRadius: "8px",
    fontWeight: 600,
    cursor: "pointer",
  },
  empty: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: "1rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  image: {
    width: "100%",
    height: "160px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "0.75rem",
  },
  productName: {
    fontSize: "1.1rem",
    fontWeight: 600,
    marginBottom: "0.25rem",
  },
  category: {
    fontSize: "0.9rem",
    color: "#6b7280",
    marginBottom: "0.25rem",
  },
    price: {
      fontSize: "1rem",
    },
  };
