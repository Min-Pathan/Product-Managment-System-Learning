import pool from "../config/db"

const fetchOrders = async()=>{
    const result = await pool.query(
    `select 
        o.id as order_id, o.total_price, o.created_at, u.name as user_name, p.name as product_name,
        oi.quantity, oi.price from orders o, 
        join users u on o.user_id = u.id
        join order_items oi on oi.order_id = o.id
        join products p on oi.products = p.id`
    )
}