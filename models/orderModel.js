import pool from "../config/db.js";

const fetchOrders = async () => {
  return await pool.query(
    `SELECT
        o.id AS order_id, o.total_price, o.created_at,
        u.name AS user_name, p.name AS product_name,
        oi.quantity, oi.price
     FROM orders o
     JOIN users u ON o.user_id = u.id
     JOIN order_items oi ON oi.order_id = o.id
     JOIN products p ON oi.product_id = p.id
     ORDER BY o.created_at DESC`
  );
};

const fetchMyOrders = async (userId) => {
  return await pool.query(
    `SELECT
        o.id AS order_id, o.total_price, o.created_at,
        p.name AS product_name, oi.quantity, oi.price
     FROM orders o
     JOIN order_items oi ON oi.order_id = o.id
     JOIN products p ON oi.product_id = p.id
     WHERE o.user_id = $1
     ORDER BY o.created_at DESC`,
    [userId]
  );
};

const createOrder = async ({ user_id, total_price }, db = pool) => {
  return await db.query(
    "INSERT INTO orders (user_id, total_price) VALUES ($1, $2) RETURNING *",
    [user_id, total_price]
  );
};

const getPriceById = async (id, db = pool) => {
  return await db.query("SELECT price FROM products WHERE id = $1", [id]);
};

const createOrderItems = async (order_id, product_id, quantity, price, db = pool) => {
  return await db.query(
    "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
    [order_id, product_id, quantity, price]
  );
};

export { fetchOrders, fetchMyOrders, createOrderItems, createOrder, getPriceById };
