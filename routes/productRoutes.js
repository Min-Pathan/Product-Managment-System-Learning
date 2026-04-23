const express = require("express");
const router = express.Router();

const {getAllProducts, addNewProduct, updateProduct, deleteProduct} = require("../controllers/productController")
const {validateCreateProduct, validateUpdateProduct, checkProductExists } = require("../middlewares/validateProduct")
const {authMiddleware, adminMiddleware}  = require("../middlewares/authMiddleware")
router.get("/", authMiddleware , getAllProducts);
router.post("/", authMiddleware , adminMiddleware, validateCreateProduct, addNewProduct)
router.put("/:id", authMiddleware , adminMiddleware, validateUpdateProduct , updateProduct)
router.delete("/:id", authMiddleware , adminMiddleware, checkProductExists, deleteProduct)

module.exports = router;