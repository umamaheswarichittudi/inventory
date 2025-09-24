import { Router } from "express";
import * as userController from "../controllers/userController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();



// Products
router.get("/products", userController.getProducts);

// Orders (protected)
router.post("/orders", authenticate, userController.placeOrder);
router.get("/orders", authenticate, userController.getOrders);

export default router;
