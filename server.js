import dotenv from "dotenv"
import express from "express";
import pool from "./config/db.js";
import logger from "./middlewares/logger.js";
import productRouter from "./routes/productRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userroutes.js";

const app = express();
app.use(express.json());

dotenv.config()

app.use(logger);

app.use("/api/products", productRouter);
app.use("/api/category", categoryRouter);
app.use("/api/auth", authRouter);
app.use("/users", userRouter);

pool.connect()
  .then(() => console.log("PostgreSQL Connected ✅"))
  .catch((err) => console.log(err));

app.listen(3002, () => {
  console.log("server started");
});
