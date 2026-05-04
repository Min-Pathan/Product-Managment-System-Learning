const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT 
        o.id AS order_id,
        o.total_price,
        o.created_at,
        p.name AS product_name,
        oi.quantity,
        oi.price
      FROM orders o
      JOIN order_items oi ON oi.order_id = o.id
      JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC
      `,
      [userId]
    );

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};
const getAllOrders = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        o.id AS order_id,
        o.total_price,
        o.created_at,
        u.name AS user_name,
        p.name AS product_name,
        oi.quantity,
        oi.price
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN order_items oi ON oi.order_id = o.id
      JOIN products p ON oi.product_id = p.id
      ORDER BY o.created_at DESC
    `);

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

export {getMyOrders, getAllOrders};