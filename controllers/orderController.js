import pool from "../config/db.js";
import {
  createOrder,
  createOrderItems,
  fetchMyOrders,
  fetchOrders,
  getPriceById,
} from "../models/orderModel.js";

const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await fetchMyOrders(userId);

    // ✅ loop rows
    for (let order of orders.rows) {
      const items = await pool.query(
        "SELECT * FROM order_items WHERE order_id = $1",
        [order.order_id],
      );

      order.items = items.rows;
    }

    const count = await pool.query(
      "SELECT COUNT(*) FROM orders WHERE user_id = $1",
      [userId],
    );

    res.json({
      data: orders.rows,
      count: count.rows[0].count,
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const result = await fetchOrders();
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const createOrderController = async (req, res) => {
  const client = await pool.connect();

  try {
    const userId = req.user.id;
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ msg: "No items provided" });
    }

    await client.query("BEGIN");

    let total = 0;

    // 🔹 Simple loop (easy to understand)
    for (let item of items) {
      const productRes = await client.query(
        "SELECT price FROM products WHERE id = $1",
        [item.product_id],
      );

      if (productRes.rows.length === 0) {
        throw new Error(`Product ${item.product_id} not found`);
      }

      const price = Number(productRes.rows[0].price);
      console.log(
        `[order] product ${item.product_id}: price=${price}, qty=${item.quantity}, line_total=${price * item.quantity}`,
      );
      total += price * item.quantity;
    }

    // 🔹 create order
    const orderRes = await client.query(
      "INSERT INTO orders (user_id, total_price) VALUES ($1, $2) RETURNING *",
      [userId, total],
    );

    const orderId = orderRes.rows[0].id;

    // 🔹 insert items
    for (let item of items) {
      const productRes = await client.query(
        "SELECT price FROM products WHERE id = $1",
        [item.product_id],
      );

      const price = Number(productRes.rows[0].price);

      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.product_id, item.quantity, price],
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      msg: "Order created",
      orderId,
      price,
      total,
    });
  } catch (err) {
    await client.query("ROLLBACK");

    res.status(500).json({
      msg: "Order failed",
      error: err.message,
    });
  } finally {
    client.release();
  }
};

const allowedStatus = ["pending", "completed", "cancelled"];
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const id = req.params.id;

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        msg: "Invalid status",
      });
    }

    const result = await pool.query(
      `UPDATE orders
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        msg: "Order not found",
      });
    }

    res.status(200).json({
      msg: "Status updated",
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      err: err.message,
    });
  }
};
export { getMyOrders, getAllOrders, createOrderController, updateOrderStatus };
