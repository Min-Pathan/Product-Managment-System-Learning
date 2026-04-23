const express = require("express");
const router = new express.Router();

const {getallUsers, updateUser, userDelete, getUserById} =  require("../controllers/userController")
router.get("/", getallUsers)
router.put("/update/:id", updateUser)
router.delete("/delete/:id", userDelete)
router.get("/:id", getUserById)

module.exports = router