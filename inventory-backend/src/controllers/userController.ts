import { Response } from "express";
import * as userService from "../services/userService";
import { AuthRequest } from "../middleware/authMiddleware";

// --- Products ---
export const getProducts = async (req: AuthRequest, res: Response) => {
  const { search, category } = req.query;
  const products = await userService.getProducts(search as string, category as string);
  res.json(products);
};

// --- Orders ---
export const placeOrder = async (req: AuthRequest, res: Response) => {
  try {
    const order = { userId: req.user.id, items: req.body.items };
    const result = await userService.placeOrder(order);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await userService.getUserOrders(req.user.id);
    res.json(orders);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
