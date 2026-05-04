import express from "express";
import { getallCategory, createCategoryController, updateCategoryController, deleteCategoryController, getCategoryBydIdcontroller, } from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", getallCategory);
router.post("/", createCategoryController);
router.put("/:id", updateCategoryController);
router.delete("/:id", deleteCategoryController)
router.get("/:id", getCategoryBydIdcontroller)

export default router;
