import pool from "../config/db.js";

const fetchCategories = async () => {
  const result = await pool.query("SELECT * FROM categories ORDER BY id");
  return result;
};

const createCategory = async ({ name }) => {
  const result = await pool.query(
    "insert into categories (name) values ($1) returning *",
    [name]
  );
  return result;
};

const updateCategory = async({name}, id)=>{
  const result = await pool.query(
    `update categories set name=$1 where id=$2 returning *`,
    [name, id]
  )
  return result
}

const deleteCategory= async(id)=>{
  const result = await pool.query(
    `delete from categories where id=$1`, [id]
  )
  return result
}

const getCategoryById = async(id)=>{
  const result = await pool.query(
    'select name from categories where id=$1', [id]
  )
  return result
}

export { fetchCategories, createCategory, updateCategory, deleteCategory, getCategoryById };
