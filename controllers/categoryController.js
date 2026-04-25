import pool from "../config/db.js";

const getallCategory = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM category ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    res.json({ err: err.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.json({ msg: "Invalid data" });
    }
    const result = await pool.query(
      "insert into category (name) values ($1) returning *",
      [name]
    );
    res.json({
      msg: "Categroy created",
      data: result.rows[0],
    });
  } catch (err) {
    res.json({ err: err.message });
  }
};

export { getallCategory, createCategory };
