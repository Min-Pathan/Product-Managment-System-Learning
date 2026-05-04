import pool from "../config/db.js";

const fetchProducts = async(query, values)=>{
    return await pool.query(query, values)
}

const fetchProductCount = async (query, values) => {
  return await pool.query(query, values);
};

const createProduct = async( {name, price, category_id, stock})=>{
    const result = await pool.query(
        'insert into products (name, price, category_id, stock) values ($1, $2, $3, $4) returning *',
        [name, price, category_id, stock]
    )

    return result;
}

const updateProduct = async({name, price, category_id, stock}, id)=>{
    const result = await pool.query(
        'update products set name=$1, price=$2, category_id=$3, stock=$4 where id=$5 returning *', 
        [name, price, category_id, stock, id]
    )
    return result
}
const deleteProduct = async(id)=>{
    const result = await pool.query(
        'delete from products where id=$1 returning *', [id]
    )
    return result
}

const getProductById = async(id)=>{
    const result = await pool.query(
        'select * from products where id=$1', [id]
    )
    return result
}

export {fetchProductCount, fetchProducts, createProduct, updateProduct, deleteProduct, getProductById}