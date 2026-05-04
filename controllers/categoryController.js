import pool from "../config/db.js";
import {
  fetchCategories,
  createCategory,
  deleteCategory,
  updateCategory,
  getCategoryById
} from "../models/categoryModel.js";

const getallCategory = async (req, res) => {
  try {
    const result = await fetchCategories();
    res.json(result.rows);
  } catch (err) {
    res.json({ err: err.message });
  }
};

const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.json({ msg: "Invalid data" });
    }
    const result = await createCategory({ name });
    res.json({
      msg: "Categroy created",
      data: result.rows[0],
    });
  } catch (err) {
    res.json({ err: err.message });
  }
};

const updateCategoryController = async(req, res)=>{
  try{
      const {name} = req.body;
      const id = req.params.id
      const result = await updateCategory({name}, id);
      res.json({
        msg:"catgeory updated",
      })
  }
  catch (err) {
    res.json({ err: err.message });
  }
}

const deleteCategoryController = async(req, res)=>{
    try{
      const id = req.params.id
      const check = await pool.query(
        'select id from products where category_id = $1 limit 1', [id]
      )
      if(check.rows.length > 0)
      {
        return res.status(400).json({
          msg:"cannot delete category. it is used in product"
        })
      }
      const result = await deleteCategory(id);
      res.json({
        msg:"catgeory deleted",
      })
  }
  catch (err) {
    res.json({ err: err.message });
  }
}

const getCategoryBydIdcontroller = async(req, res)=>{
  try{
    const id = req.params.id;
    const result = await getCategoryById(id);
     res.json(result.rows)
  }
  catch(err){
    res.json({err: err.message})
  }
}

export { getallCategory, createCategoryController , updateCategoryController, deleteCategoryController, getCategoryBydIdcontroller};
