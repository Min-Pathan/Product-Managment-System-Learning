import pool from "../config/db.js";

const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query("select * from products");
    res.json(result.rows);
  } catch (err) {
    res.json({ error: err.message });
  }
};

const craeteProduct = async (req, res) => {
  try {
    const { name, price, category, stock } = req.body;
    if (!name || !price || !category || !stock) {
      return res.json({ msg: "Invalid data" });
    }
    const result = await pool.query(
      "insert into products (name, price, category, stock) values ($1, $2, $3, $4) returning *",
      [name, price, category, stock],
    );
    res.json({
      msg: "Product created",
      data: result.rows[0],
    });
  } catch (err) {
    res.json({ err: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, price, category, stock } = req.body;
    const result = await pool.query(
      `update products set name=$1, price=$2, category=$3, stock=$4 where id=$5 returning *`,
      [name, price, category, stock, id],
    );
    if (result.rows.length === 0) {
      return res.json({ msg: "Product not found" });
    }

    res.status(200).json({
      msg: "Product updated",
      data: result.rows[0],
    });
  } catch (err) {
    res.json({ err: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query(
      "Delete from products where id=$1 returning *",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        msg: "Product not found",
      });
    }

    res.status(200).json({
      msg: "Product deleted",
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ message:"server error",err: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query(
      "select id, name, price from products where id=$1",
      [id],
    );
    if (result.rows.length === 0) {
      return res.json({ err: "Product not found" });
    }
    res.json({ data: result.rows[0] });
  } catch (err) {
    req.json({ err: err.message });
  }
};
export {
  getAllProducts,
  craeteProduct,
  updateProduct,
  deleteProduct,
  getProductById,
};
