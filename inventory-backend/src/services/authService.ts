import { db } from "../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel";

export const registerUser = async (user: User) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  await db.query("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", [
    user.name,
    user.email,
    hashedPassword,
    "user",
  ]);
};

export const loginUser = async (email: string, password: string) => {
  const [rows]: any = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  if (rows.length === 0) throw new Error("User not found");

  const user = rows[0];

  let isMatch = false;

  // If password is hashed (bcrypt format)
  if (user.password.startsWith("$2a$")) {
    isMatch = await bcrypt.compare(password, user.password);
  } else {
    // Plain text check
    isMatch = password === user.password;
  }

  if (!isMatch) throw new Error("Invalid password");

  const token = jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "1d" }
  );

  return { token, user };
};
