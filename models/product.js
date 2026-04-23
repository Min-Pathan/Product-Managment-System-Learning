const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  price: Number,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"Category"
  },
  stock: Number,
});

module.exports = mongoose.model("Product", productSchema);
