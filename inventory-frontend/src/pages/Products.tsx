import { useEffect, useState } from "react";
import api from "../api/api";

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([
    "All",
    "Electronics",
    "Accessories",
    "Clothing",
  ]);
  const [cart, setCart] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]); // 🆕 My Orders state
  const [message, setMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products"); // 🆕 Tabs

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, [category]);

  const loadProducts = async () => {
    try {
      const query =
        category && category !== "All" ? `?category=${category}` : "";
      const res = await api.get(`/user/products${query}`);
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  const loadOrders = async () => {
    try {
      const res = await api.get("/user/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  const addToCart = (product: any) => {
    if (product.stock < 1) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        { productId: product.id, name: product.name, quantity: 1 },
      ];
    });

    // reduce stock instantly in UI
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id ? { ...p, stock: p.stock - 1 } : p
      )
    );

    // 🆕 Add to My Orders instantly (pending order)
    setOrders((prev) => [
      {
        id: Date.now(),
        created_at: new Date().toISOString(),
        items: [{ name: product.name, price: product.price, quantity: 1 }],
        total: product.price,
        pending: true,
      },
      ...prev,
    ]);

    setMessage(`🛒 ${product.name} added to cart & My Orders`);
  };

  const handleCheckout = async () => {
    try {
      if (cart.length === 0) {
        setMessage("Cart is empty!");
        return;
      }

      await api.post("/user/orders", { items: cart });
      setMessage("✅ Order placed successfully!");

      setCart([]);
      loadProducts(); // refresh stock
      loadOrders(); // refresh orders from DB (confirmed)
      setActiveTab("orders");
    } catch (err) {
      setMessage("❌ Failed to place order");
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
          {/* Category Filter */}
          <div style={styles.filterBox}>
            <label style={styles.label}>Filter by Category: </label>
            <select
              style={styles.select}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat === "All" ? "" : cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {products.length === 0 ? (
            <p style={styles.empty}>No products available</p>
          ) : (
            <div style={styles.grid}>
              {products.map((p) => (
                <div key={p.id} style={styles.card}>
                  {p.image_url && (
                    <img src={p.image_url} alt={p.name} style={styles.image} />
                  )}

                  <div style={styles.details}>
                    <h3 style={styles.name}>{p.name}</h3>
                    <p style={styles.category}>{p.category}</p>
                    <p style={styles.price}>₹ {p.price}</p>
                    <p
                      style={{
                        ...styles.stock,
                        color:
                          p.stock > 5
                            ? "#059669"
                            : p.stock > 0
                            ? "#d97706"
                            : "#dc2626",
                      }}
                    >
                      Stock: {p.stock}
                    </p>
                  </div>

                  <button
                    style={{
                      ...styles.button,
                      background: p.stock < 1 ? "#d1d5db" : "#2563eb",
                      color: p.stock < 1 ? "#6b7280" : "#fff",
                      cursor: p.stock < 1 ? "not-allowed" : "pointer",
                    }}
                    onClick={() => addToCart(p)}
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
                  <h4>
                    Order #{order.id}{" "}
                    {order.pending && (
                      <span style={{ color: "orange" }}>(Pending)</span>
                    )}
                  </h4>
                  <p>{new Date(order.created_at).toLocaleString()}</p>
                  <ul>
                    {order.items.map((item: any, idx: number) => (
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
  container: { padding: "20px", minHeight: "100vh", background: "#f9fafb" },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
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
  filterBox: {
    marginBottom: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  },
  label: { fontWeight: 500, color: "#374151" },
  select: {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
  },
  empty: { textAlign: "center", color: "#6b7280" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    columnGap: "20px",
    rowGap: "40px",
  },
  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "12px",
  },
  details: { flexGrow: 1 },
  name: { fontSize: "16px", fontWeight: 600, color: "#111827" },
  category: { fontSize: "14px", color: "#6b7280" },
  price: { fontSize: "15px", fontWeight: 500, color: "#374151" },
  stock: { fontSize: "14px", marginBottom: "8px" },
  button: {
    marginTop: "auto",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    fontWeight: 500,
  },
  cartBox: {
    marginTop: "2rem",
    padding: "1rem",
    background: "#f3f4f6",
    borderRadius: "12px",
    maxWidth: "500px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  cartTitle: {
    fontSize: "1.25rem",
    fontWeight: 600,
    marginBottom: "0.75rem",
  },
  cartList: { listStyle: "none", padding: 0, margin: 0 },
  cartItem: { fontSize: "0.95rem", marginBottom: "0.5rem" },
  checkoutBtn: {
    marginTop: "1rem",
    width: "100%",
    padding: "0.75rem",
    background: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: 600,
    cursor: "pointer",
  },
  orderCard: {
    background: "#fff",
    padding: "1rem",
    borderRadius: "12px",
    marginBottom: "1rem",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },
  orderTotal: {
    marginTop: "0.5rem",
    fontWeight: 600,
    color: "#111827",
  },
};
