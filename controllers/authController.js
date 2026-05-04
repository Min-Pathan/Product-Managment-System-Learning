import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserByEmail } from "../models/userModel.js";

const registerController = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );
    if (existing.rows.length > 0) {
      return res.json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role`,
      [name, email, hashedPassword, role || "user"]
    );

    res.json({ msg: "User registered", data: result.rows[0] });
  } catch (err) {
    res.json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await findUserByEmail(email)
    if (result.rows.length === 0) {
      return res.json({ msg: "User not found" });
    }
    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      msg: "login successful",
      token,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (err) {
    res.json({ error: err.message });
  }
};

export { registerController, login };
