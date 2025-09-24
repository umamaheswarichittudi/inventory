import { db } from "../config/db";
import { Product } from "../models/productModel";

export const addProduct = async (product: Product) => {
  await db.query("INSERT INTO products (name, category, price, stock) VALUES (?, ?, ?, ?)", [
    product.name,
    product.category,
    product.price,
    product.stock,
  ]);
};

export const updateProduct = async (id: number, product: Product) => {
  await db.query("UPDATE products SET name=?, category=?, price=?, stock=? WHERE id=?", [
    product.name,
    product.category,
    product.price,
    product.stock,
    id,
  ]);
};
// ✅ NEW: Get all products
export const getAllProducts = async () => {
  const [rows] = await db.query("SELECT * FROM products");
  return rows;
};
export const deleteProduct = async (id: number) => {
  await db.query("DELETE FROM products WHERE id=?", [id]);
};

export const getAllOrders = async () => {
  const [rows] = await db.query("SELECT * FROM orders");
  return rows;
};

export const getLowStock = async () => {
  const [rows] = await db.query("SELECT * FROM products WHERE stock < 5");
  return rows;
};

export const getTopSelling = async () => {
  const [rows] = await db.query(
    `SELECT p.id, p.name, SUM(oi.quantity) as totalSold
     FROM order_items oi
     JOIN products p ON oi.productId = p.id
     GROUP BY p.id
     ORDER BY totalSold DESC
     LIMIT 5`
  );
  return rows;
};
