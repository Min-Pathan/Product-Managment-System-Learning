const express = require("express");
const router = express.Router();

const {getAllProducts, addNewProduct, updateProduct, deleteProduct} = require("../controllers/productController")
const {validateCreateProduct, validateUpdateProduct, checkProductExists } = require("../middlewares/validateProduct")
router.get("/", getAllProducts);
router.post("/", validateCreateProduct, addNewProduct)
router.put("/:id", validateUpdateProduct , updateProduct)
router.delete("/:id", checkProductExists, deleteProduct)

module.exports = router;