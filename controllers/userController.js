import {
  fetchUsers,
  fetchUserCount,
  updateUser as updateUserDb,
  deleteUser as deleteUserDb,
  getUserById as getUserByIdDb,
} from "../models/userModel.js";

const getallUsers = async (req, res) => {
  try {
    let { sortBy, order, page = 1, limit = 5, keyword } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;
    const allowedFields = ["id", "name", "email", "role"];
    const finalSortBy = allowedFields.includes(sortBy) ? sortBy : "id";
    const sortOrder = order === "desc" ? "DESC" : "ASC";

    let whereClause = "";
    let values = [];
    let valueIndex = 1;
    if (keyword) {
      whereClause = `WHERE name ILIKE $${valueIndex} OR email ILIKE $${valueIndex}`;
      values.push(`%${keyword}%`);
      valueIndex++;

      // 👉 if keyword is number → search numeric fields
      if (!isNaN(keyword)) {
        whereClause += `
      OR id = $${valueIndex}
    `;
        values.push(parseInt(keyword));
        valueIndex++;
      }
    }

    const query = `
      SELECT * FROM users
      ${whereClause}
      ORDER BY ${finalSortBy} ${sortOrder}
      LIMIT $${valueIndex} OFFSET $${valueIndex + 1}
    `;

    const result = await fetchUsers(query, [...values, limit, offset]);
    const countResult = await fetchUserCount("SELECT COUNT(*) FROM users", []);
    const total = parseInt(countResult.rows[0].count);
    res.json({
      total,
      page,
      limit,
      data: result.rows,
    });
  } catch (err) {
    res.json({ err: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, password, email, role } = req.body;
    const result = await updateUserDb({ name, password, email, role }, id);
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

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await deleteUserDb(id);
    if (result.rows.length === 0) {
      return res.json({ msg: "user not found" });
    }

    res.json({
      msg: "user deleted",
      data: result.rows[0],
    });
  } catch (err) {
    res.json({ err: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await getUserByIdDb(id);
    if (result.rows.length === 0) {
      return res.json({ msg: "User not found" });
    }
    res.json({ data: result.rows[0] });
  } catch (error) {
    res.json({ error: error.message });
  }
};

export { getallUsers, updateUser, deleteUser, getUserById };
