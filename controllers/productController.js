const Product = require("../models/product");
const Category = require("../models/category")
const getAllProducts = async (req, res) => {
  try {
    const {
      keyword,
      sortBy = "id",
      order = "asc",
      page = 1,
      limit = 5,
      category
    } = req.query;
    let filters = {};
    let categoryFilters = {};
    const allowedfield = ["id", "name", "price", "category", "stock"];
    const finalSortby = allowedfield.includes(sortBy) ? sortBy : "id";
    const findCategory = await Category.findOne({
      name: { $regex: category, $options: "i" } 
    })
    if(category){
      const foundCategory = await Category.findOne({
        name:{$regex:category, $options : "i"}
      })
      if(foundCategory)
      {
        categoryFilters.category = foundCategory._id;
      }
      else{
        res.json({mesg:"category not found"})
      }
    }
    if (keyword) {
      filters.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { id: isNaN(keyword) ? undefined : parseInt(keyword) },
        { price: isNaN(keyword) ? undefined : parseInt(keyword) },
           findCategory ? { category: findCategory._id } : null,
        { stock: isNaN(keyword) ? undefined : parseInt(keyword) },
      ].filter(Boolean);
    }
    const sortOrder = order === "desc" ? -1 : 1;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const finalFilters ={...filters, ...categoryFilters}
    const products = await Product.find(finalFilters)
    .populate("category", "name", )
      .collation({ locale: "en", strength: 2 })
      .sort({
        [finalSortby]: sortOrder,
      })
      .skip(skip)
      .limit(parseInt(limit));
    const total = await Product.countDocuments(finalFilters);
    res.json({
      total: total,
      page: Number(page),
      limit: Number(limit),
      data: products,
    });
  } catch (err) {
    res.json({ err: err.message });
  }
};

const addNewProduct = async (req, res) => {
  try {
    const data = req.body;
    const productData = new Product(data);
    await productData.save();
    res.json({
      msg: "Product added",
      data: productData,
    });
  } catch (err) {
    res.json({ err: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updatedData = req.body;
    const pr = await Product.findOneAndUpdate({ id: parseInt(id) }, updatedData, {
      new: true,
    });
    res.json({
      msg: "Product updated",
      data: pr,
    });
  } catch (err) {
    res.json({ err: err.message });
  }
};

const deleteProduct = async(req, res)=>{
    try{
        const id = req.params.id;
        const deletedProduct = await Product.findOneAndDelete({id: parseInt(id)})
        res.json({
            msg:"deleted successfully"
        })
    }
    catch(error){
        res.json({error:error.message})
    }
}

module.exports = { getAllProducts, addNewProduct , updateProduct, deleteProduct};
