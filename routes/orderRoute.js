import express from "express";
import { getAllOrders, getMyOrders } from "../controllers/orderController";
import { adminMiddleware, authMiddleware } from "../middlewares/authMiddleware";
const router = express.Router();

router.get("/my-orders", getMyOrders); //for user
router.get("/", authMiddleware, adminMiddleware, getAllOrders);  //for admin