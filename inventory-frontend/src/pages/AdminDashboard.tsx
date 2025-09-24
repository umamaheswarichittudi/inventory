import { useEffect, useState } from "react";
import api from "../api/api";

export default function AdminDashboard() {
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [topSelling, setTopSelling] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const [showProducts, setShowProducts] = useState(false);

  // Product form states (include id for edit)
  const [formProduct, setFormProduct] = useState<{ id?: number | null; name: string; stock: string; price: string; category?: string }>({
    id: null,
    name: "",
    stock: "",
    price: "",
    category: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [low, top, prod, ord] = await Promise.all([
      api.get("/admin/reports/low-stock"),
      api.get("/admin/reports/top-selling"),
      api.get("/admin/products"),
      api.get("/admin/orders"),
    ]);
    setLowStock(low.data);
    setTopSelling(top.data);
    setProducts(prod.data);
    setOrders(ord.data);
  };

  // Add or Update Product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formProduct.id) {
      await api.put(`/admin/products/${formProduct.id}`, formProduct);
    } else {
      await api.post("/admin/products", formProduct);
    }
    setFormProduct({ id: null, name: "", stock: "", price: "", category: "" });
    fetchData();
  };

  // Delete product
  const handleDelete = async (id: number) => {
    await api.delete(`/admin/products/${id}`);
    fetchData();
  };

  // Edit product
  const handleEdit = (p: any) => {
    setFormProduct({ id: p.id, name: p.name, stock: p.stock, price: p.price, category: p.category });
  };

  return (
    <div style={styles.container}>
      {/* Dashboard Header */}
      <div style={styles.header}>
        <h2 style={styles.title}> Admin Dashboard</h2>
        <p style={styles.subtitle}>Manage products, orders, and track performance</p>
      </div>

      {/* Grid Reports */}
      <div style={styles.grid}>
        {/* Low Stock Section */}
        <div style={{ ...styles.card, border: "1px solid #fecaca" }}>
          <h3 style={{ ...styles.cardTitle, color: "#dc2626" }}>Low Stock Products</h3>
          {lowStock.length === 0 ? (
            <p style={styles.empty}>All products have sufficient stock.</p>
          ) : (
            <ul style={styles.list}>
              {lowStock.map((p) => (
                <li key={p.id} style={{ ...styles.listItem, background: "#fee2e2" }}>
                  <span style={styles.itemName}>{p.name}</span>
                  <span style={{ ...styles.itemValue, color: "#b91c1c" }}>Stock: {p.stock}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Top Selling Section */}
        <div style={{ ...styles.card, border: "1px solid #bfdbfe" }}>
          <h3 style={{ ...styles.cardTitle, color: "#2563eb" }}>Top Selling Products</h3>
          {topSelling.length === 0 ? (
            <p style={styles.empty}>No sales data available yet.</p>
          ) : (
            <ul style={styles.list}>
              {topSelling.map((p, index) => (
                <li key={p.id} style={{ ...styles.listItem, background: "#dbeafe" }}>
                  <span style={styles.itemName}>
                    {index + 1}. {p.name}
                  </span>
                  <span style={{ ...styles.itemValue, color: "#1d4ed8" }}>Sold: {p.total_sold}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Button to view all products */}
      <button style={styles.viewBtn} onClick={() => setShowProducts(!showProducts)}>
        {showProducts ? "Hide Products" : "View All Products"}
      </button>

      {/* Manage Products Section (only when showProducts=true) */}
      {showProducts && (
        <div style={{ ...styles.card, marginTop: "2rem", width: "100%", maxWidth: "1000px" }}>
          <h3 style={{ ...styles.cardTitle, color: "#065f46" }}>Manage Products</h3>

          {/* Add/Update Product Form */}
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              style={styles.input}
              placeholder="Product Name"
              value={formProduct.name}
              onChange={(e) => setFormProduct({ ...formProduct, name: e.target.value })}
              required
            />
            <input
              style={styles.input}
              placeholder="Category"
              value={formProduct.category}
              onChange={(e) => setFormProduct({ ...formProduct, category: e.target.value })}
              required
            />
            <input
              style={styles.input}
              placeholder="Stock"
              type="number"
              value={formProduct.stock}
              onChange={(e) => setFormProduct({ ...formProduct, stock: e.target.value })}
              required
            />
            <input
              style={styles.input}
              placeholder="Price"
              type="number"
              value={formProduct.price}
              onChange={(e) => setFormProduct({ ...formProduct, price: e.target.value })}
              required
            />
            <button style={styles.button}>{formProduct.id ? "Update Product" : "Add Product"}</button>
          </form>

          {/* Products Table */}
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Stock</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td style={styles.td}>{p.id}</td>
                  <td style={styles.td}>{p.name}</td>
                  <td style={styles.td}>{p.category}</td>
                  <td style={styles.td}>₹{p.price}</td>
                  <td style={styles.td}>{p.stock}</td>
                  <td style={styles.td}>
                    <button style={styles.editBtn} onClick={() => handleEdit(p)}>Edit</button>
                    <button style={styles.deleteBtn} onClick={() => handleDelete(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Orders Section */}
      <div style={{ ...styles.card, marginTop: "2rem", width: "100%", maxWidth: "900px" }}>
        <h3 style={{ ...styles.cardTitle, color: "#7c3aed" }}> Orders</h3>
        {orders.length === 0 ? (
          <p style={styles.empty}>No orders available.</p>
        ) : (
          <ul style={styles.list}>
            {orders.map((o) => (
              <li key={o.id} style={{ ...styles.listItem, background: "#ede9fe" }}>
                <span style={styles.itemName}>Order #{o.id}</span>
                <span style={styles.itemValue}>
                  {o.product_name} - Qty: {o.quantity}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// 🎨 Internal Styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom right, #f9fafb, #f3f4f6)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2rem",
  },
  header: {
    marginBottom: "2rem",
    textAlign: "center",
  },
  title: {
    fontSize: "2rem",
    fontWeight: 700,
    color: "#1f2937",
    marginBottom: "0.5rem",
  },
  subtitle: {
    color: "#6b7280",
    fontSize: "1rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "2rem",
    width: "100%",
    maxWidth: "1000px",
  },
  card: {
    background: "white",
    borderRadius: "16px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
    padding: "1.5rem",
    transition: "all 0.3s ease",
  },
  cardTitle: {
    fontSize: "1.25rem",
    fontWeight: 600,
    marginBottom: "1rem",
  },
  empty: {
    color: "#6b7280",
    fontSize: "0.95rem",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem 1rem",
    borderRadius: "10px",
    marginBottom: "0.5rem",
  },
  itemName: {
    fontWeight: 500,
    color: "#374151",
  },
  itemValue: {
    fontSize: "0.9rem",
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "1rem",
    flexWrap: "wrap",
  },
  input: {
    flex: 1,
    padding: "0.5rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "0.9rem",
  },
  button: {
    background: "linear-gradient(90deg, #16a34a, #22c55e)",
    color: "white",
    padding: "0.6rem 1.2rem",
    borderRadius: "8px",
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
  },
  viewBtn: {
    marginTop: "1.5rem",
    background: "#2563eb",
    color: "white",
    padding: "0.6rem 1.2rem",
    borderRadius: "8px",
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
  },
  editBtn: {
    background: "#3b82f6",
    color: "white",
    padding: "0.4rem 0.8rem",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    marginRight: "0.5rem",
  },
  deleteBtn: {
    background: "#ef4444",
    color: "white",
    padding: "0.4rem 0.8rem",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1rem",
  },
  th: {
    textAlign: "left",
    borderBottom: "2px solid #ddd",
    padding: "0.75rem",
    background: "#f9fafb",
  },
  td: {
    borderBottom: "1px solid #eee",
    padding: "0.75rem",
  },
};
