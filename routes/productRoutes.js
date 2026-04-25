import express from "express";
import { getAllProducts, craeteProduct, updateProduct, deleteProduct, getProductById } from "../controllers/productController.js";
import { checkProductExists, validateCreateProduct, validateUpdateProduct } from "../middlewares/validateProduct.js";
import { adminMiddleware, authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/",authMiddleware, getAllProducts);
router.post("/",authMiddleware, adminMiddleware, validateCreateProduct, craeteProduct);
router.put("/:id",authMiddleware, adminMiddleware,validateUpdateProduct , updateProduct);
router.delete("/:id",authMiddleware,  adminMiddleware,checkProductExists, deleteProduct)
router.get("/:id",authMiddleware, getProductById)

export default router;
