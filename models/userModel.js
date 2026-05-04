import pool from "../config/db.js";

const findUserByEmail = async (email) => {
  const result = await pool.query(
    "select * from users where email=$1",
    [email]
  );
  return result;
};

const rergister = async({name, email, password, role})=>{
  const result = await pool.query(
   `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role`,
      [name, email, hashedPassword, role]
  )
}
const fetchUsers = async (query, values) => {
  return await pool.query(query, values);
};

const fetchUserCount = async (query, values) => {
  return await pool.query(query, values);
};

const updateUser = async ({ name, password, email, role }, id) => {
  const result = await pool.query(
    "update users set name=$1, password=$2, email=$3, role=$4 where id=$5 returning *",
    [name, password, email, role, id]
  );
  return result;
};

const deleteUser = async (id) => {
  const result = await pool.query(
    "delete from users where id=$1 returning *",
    [id]
  );
  return result;
};

const getUserById = async (id) => {
  const result = await pool.query(
    "select id, name, email, role from users where id=$1",
    [id]
  );
  return result;
};

export {
  findUserByEmail,
  fetchUsers,
  fetchUserCount,
  updateUser,
  deleteUser,
  getUserById,
  rergister
};
