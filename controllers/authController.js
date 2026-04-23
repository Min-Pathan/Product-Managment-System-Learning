const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });
    await user.save();
    res.json({ msg: "User registered", data: user });
  } catch (err) {
    res.json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, "secretkey", {
      expiresIn: "1h",
    });

    res.json({
      msg: "login successful",
      token,
      data: {
        user,
      },
    });
  } catch (err) {
    res.json({ error: err.message });
  }
};

module.exports = { register, login};
