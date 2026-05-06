import express from "express";
import { createOrderController, getAllOrders, getMyOrders, updateOrderStatus } from "../controllers/orderController.js";
import { adminMiddleware, authMiddleware } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/my-orders", authMiddleware, getMyOrders); //for user
router.get("/", authMiddleware, adminMiddleware, getAllOrders);  //for admin

router.post("/", authMiddleware, createOrderController); // any logged-in user can place an order

router.put("/:id/status", authMiddleware, adminMiddleware, updateOrderStatus);

export default router;