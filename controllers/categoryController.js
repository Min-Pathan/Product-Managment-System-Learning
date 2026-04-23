const Category = require("../models/category");

const getallCategory = async (req, res) => {
  try {
const categories = await Category.find();
res.json(categories);
  } catch (err) {
    res.json({ err: err.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const data = req.body;
    const category = new Category(data);
    await category.save();
    res.json({
      msg: "category added",
      data: category,
    });
  } catch (err) {
    res.json({ error: err.message });
  }
};

module.exports = { getallCategory, createCategory };
