import pool from "../config/db.js";

const validateCreateProduct = async (req, res, next) => {
  try {
    const { name, price, category, stock } = req.body;

    if (!name || !price || !category || stock === undefined) {
      return res.json({ message: "All fields required" });
    }

    const existing = await pool.query(
      "SELECT id FROM products WHERE name ILIKE $1",
      [name]
    );
    if (existing.rows.length > 0) {
      return res.json({ message: "Product already exists" });
    }

    next();
  } catch (err) {
    res.json({ error: err.message });
  }
};

const validateUpdateProduct = (req, res, next) => {
  const { name, price, category, stock } = req.body;

  if (!name && !price && !category && stock === undefined) {
    return res.json({ message: "At least one field required" });
  }

  next();
};

const checkProductExists = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const result = await pool.query(
      "SELECT id FROM products WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.json({ message: "Product not found" });
    }
    next();
  } catch (err) {
    res.json({ error: err.message });
  }
};

export { validateUpdateProduct, validateCreateProduct, checkProductExists };
