const express = require("express");
const router = express.Router();

const {getallCategory, createCategory} = require("../controllers/categoryController")

router.get("/", getallCategory);
router.post("/", createCategory);

module.exports = router;