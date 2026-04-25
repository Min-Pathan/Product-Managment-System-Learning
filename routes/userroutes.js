import express from "express";
import { getallUsers, updateUser, deleteUser, getUserById } from "../controllers/userController.js";

const router = express.Router();

router.get("/", getallUsers);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);
router.get("/:id", getUserById);

export default router;
