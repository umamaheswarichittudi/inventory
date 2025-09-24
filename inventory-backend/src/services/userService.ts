import { db } from "../config/db";

import { Order } from "../models/orderModel";

// --- Product services ---
export const getProducts = async (search?: string, category?: string) => {
  let query = "SELECT * FROM products WHERE 1=1";
  const params: any[] = [];

  if (search) {
    query += " AND name LIKE ?";
    params.push(`%${search}%`);
  }
  if (category) {
    query += " AND category=?";
    params.push(category);
  }

  const [rows] = await db.query(query, params);
  return rows;
};

// --- Order services ---
export const placeOrder = async (order: Order) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [result]: any = await connection.query("INSERT INTO orders (userId) VALUES (?)", [
      order.userId,
    ]);
    const orderId = result.insertId;

    for (const item of order.items) {
      const [rows]: any = await connection.query("SELECT stock FROM products WHERE id=?", [
        item.productId,
      ]);
      if (rows[0].stock < item.quantity) throw new Error("Insufficient stock");

      await connection.query(
        "INSERT INTO order_items (orderId, productId, quantity) VALUES (?, ?, ?)",
        [orderId, item.productId, item.quantity]
      );

      await connection.query("UPDATE products SET stock = stock - ? WHERE id=?", [
        item.quantity,
        item.productId,
      ]);
    }

    await connection.commit();
    return { orderId };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

export const getUserOrders = async (userId: number) => {
  const [rows] = await db.query("SELECT * FROM orders WHERE userId=?", [userId]);
  return rows;
};
