const express = require("express");
const app = express();
app.use(express.json());

const logger = require("./middlewares/logger")
app.use(logger);

const productRouter = require("./routes/productRoutes")
app.use("/api/products", productRouter)

const categoryRouter = require("./routes/categoryRoutes");
app.use("/api/category", categoryRouter)

const authRouter = require("./routes/authRoute");
app.use("/api/auth", authRouter)

const userRouter = require("./routes/userroutes");
app.use("/users", userRouter)

const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://admin:admin@cluster0.0zct9gw.mongodb.net/")
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log(err));
  
app.listen(3002, ()=>{
    console.log("server started")
})
