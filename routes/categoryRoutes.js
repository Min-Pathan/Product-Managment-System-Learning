import express from "express";
import { getallCategory, createCategory } from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", getallCategory);
router.post("/", createCategory);

export default router;
