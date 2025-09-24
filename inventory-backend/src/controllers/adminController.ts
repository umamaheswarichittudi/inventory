import { Request, Response } from "express";
import * as adminService from "../services/adminService";

export const addProduct = async (req: Request, res: Response) => {
  try {
    await adminService.addProduct(req.body);
    res.json({ message: "Product added" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    await adminService.updateProduct(Number(req.params.id), req.body);
    res.json({ message: "Product updated" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await adminService.deleteProduct(Number(req.params.id));
    res.json({ message: "Product deleted" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ NEW: Get all products
export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await adminService.getAllProducts();
    res.json(products);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getOrders = async (_req: Request, res: Response) => {
  const orders = await adminService.getAllOrders();
  res.json(orders);
};

export const lowStock = async (_req: Request, res: Response) => {
  const products = await adminService.getLowStock();
  res.json(products);
};

export const topSelling = async (_req: Request, res: Response) => {
  const products = await adminService.getTopSelling();
  res.json(products);
};
