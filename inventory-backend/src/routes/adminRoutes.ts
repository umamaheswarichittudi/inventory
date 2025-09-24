import { Router } from "express";
import * as adminController from "../controllers/adminController";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

router.post("/products", authenticate, authorize(["admin"]), adminController.addProduct);
router.put("/products/:id", authenticate, authorize(["admin"]), adminController.updateProduct);
router.delete("/products/:id", authenticate, authorize(["admin"]), adminController.deleteProduct);

// ✅ NEW: fetch all products
router.get("/products", authenticate, authorize(["admin"]), adminController.getAllProducts);

router.get("/orders", authenticate, authorize(["admin"]), adminController.getOrders);
router.get("/reports/low-stock", authenticate, authorize(["admin"]), adminController.lowStock);
router.get("/reports/top-selling", authenticate, authorize(["admin"]), adminController.topSelling);

export default router;
