import { createProduct, fetchProductCount, fetchProducts, getProductById, updateProduct, deleteProduct } from "../models/productModel.js";

const getAllProducts = async (req, res) => {
  try {
    let {
      keyword,
      category,
      minPrice,
      maxPrice,
      sortBy,
      order,
      page = 1,
      limit = 10,
    } = req.query; // ✅ FIXED

    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    const allowedFields = [
      "id",
      "name",
      "price",
      "stock",
      "created_at",
    ];

    const finalSortBy = allowedFields.includes(sortBy)
      ? `p.${sortBy}`
      : "p.id";

    const sortOrder = order === "desc" ? "DESC" : "ASC";

    let conditions = [];
    let values = [];
    let valueIndex = 1;

    // 🔍 SEARCH
    if (keyword) {
      conditions.push(
        `(p.name ILIKE $${valueIndex} OR c.name ILIKE $${valueIndex})`
      );
      values.push(`%${keyword}%`);
      valueIndex++;
    }

    // 📂 CATEGORY FILTER
    if (category) {
      conditions.push(`c.name ILIKE $${valueIndex}`);
      values.push(`%${category}%`);
      valueIndex++;
    }

    // 💰 PRICE FILTER
    if (minPrice) {
      conditions.push(`p.price >= $${valueIndex}`);
      values.push(Number(minPrice));
      valueIndex++;
    }

    if (maxPrice) {
      conditions.push(`p.price <= $${valueIndex}`);
      values.push(Number(maxPrice));
      valueIndex++;
    }

    const whereClause =
      conditions.length > 0
        ? `WHERE ${conditions.join(" AND ")}`
        : "";

    // 🔥 MAIN QUERY WITH JOIN
    const productQuery = `
      SELECT 
        p.*,
        c.name AS category_name
      FROM products p
      LEFT JOIN categories c
      ON p.category_id = c.id
      ${whereClause}
      ORDER BY ${finalSortBy} ${sortOrder}
      LIMIT $${valueIndex} OFFSET $${valueIndex + 1}
    `;

    const countQuery = `
      SELECT COUNT(*)
      FROM products p
      LEFT JOIN categories c
      ON p.category_id = c.id
      ${whereClause}
    `;

    const result = await fetchProducts(productQuery, [
      ...values,
      limit,
      offset,
    ]);

    const countResult = await fetchProductCount(countQuery, values);

    const total = parseInt(countResult.rows[0].count);

    res.json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: result.rows,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createProductController = async (req, res) => {
  try {
    const { name, price, category_id, stock } = req.body;
    if (!name || !price || !category_id || !stock) {
      return res.status(400).json({ msg: "Invalid data" });
    }
    const result = await createProduct({name, price, category_id, stock})
    res.status(200).json({
      msg: "Product created",
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const updateProductcontroller = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, price, category_id, stock } = req.body;
    const result = await updateProduct({name, price, category_id, stock}, id)
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

const deleteProductController = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await deleteProduct(id)
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
    res.status(500).json({ message: "server error", err: err.message });
  }
};

const getProductByIdController = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await getProductById(id);
    if (result.rows.length === 0) {
      return res.json({ err: "Product not found" });
    }
    res.json({ data: result.rows[0] });
  } catch (err) {
    res.json({ err: err.message });
  }
};
export {
  getAllProducts,
  createProductController,
  updateProductcontroller,
  deleteProductController,
  getProductByIdController,
};
