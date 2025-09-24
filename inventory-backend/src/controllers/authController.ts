// controllers/authController.ts
import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/authService";

export const signup = async (req: Request, res: Response) => {
  try {
    await registerUser(req.body);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
