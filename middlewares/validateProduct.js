const Product = require("../models/product");

const validateCreateProduct = (req, res, next) => {
  const { id, name, price, category, stock } = req.body;

  if (!id || !name || !price || !category || !stock) {
    return res.json({ message: "All fields required" });
  }

  next();
};

const validateUpdateProduct = (req, res, next) => {
  const { name, price, category, stock } = req.body;

  if (!name && !price && !category && !stock) {
    return res.json({ message: "At least one field required" });
  }

  next();
};

const checkProductExists = async (req, res, next) => {
  const id = parseInt(req.params.id);

  const product = await Product.findOne({ id });

  if (!product) {
    return res.json({ message: "Product not found" });
  }

  next();
};
module.exports={validateUpdateProduct, validateCreateProduct, checkProductExists}