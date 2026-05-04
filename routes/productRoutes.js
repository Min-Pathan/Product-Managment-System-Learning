import express from "express";
import {
  getAllProducts,
  createProductController,
  updateProductcontroller,
  deleteProductController,
  getProductByIdController,
} from "../controllers/productController.js";
import {
  checkProductExists,
  validateCreateProduct,
  validateUpdateProduct,
} from "../middlewares/validateProduct.js";
import {
  adminMiddleware,
  authMiddleware,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAllProducts);
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  validateCreateProduct,
  createProductController,
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateUpdateProduct,
  updateProductcontroller,
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  checkProductExists,
  deleteProductController,
);
router.get("/:id", authMiddleware, getProductByIdController);

export default router;
