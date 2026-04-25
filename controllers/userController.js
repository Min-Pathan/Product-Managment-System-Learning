import pool from "../config/db.js";

const getallUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * from users");
    res.json(result.rows);
  } catch (err) {
    res.json({ err: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, password, email, role } = req.body;
    const result = await pool.query(
      `update users set name=$1, password=$2, email=$3, role=$4 where id=$5 returning *`,
      [name, password, email, role, id]
    );
    if (result.rows.length === 0) {
      return res.json({ msg: "User not found" });
    }

    res.json({
      msg: "User updated",
      data: result.rows[0],
    });
  } catch (err) {
    res.json({ err: err.message });
  }
};

const deleteUser = async(req, res)=>{
   try {
    const id = req.params.id;
    const result = await pool.query("Delete from users where id=$1 returning *", [id])
    if (result.rows.length === 0) {
      return res.json({ msg: "user not found" });
    }

    res.json({
      msg: "user deleted",
      data: result.rows[0],
    });
   }
   catch(err){
    req.json({err: err.message})
   }
}

const getUserById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.json({ msg: "User not found" });
    }
    res.json({ data: result.rows[0] });
  } catch (error) {
    res.json({ error: error.message });
  }
};

export { getallUsers, updateUser, deleteUser, getUserById };
