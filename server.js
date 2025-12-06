import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./utils/db.js";

import productsRoute from "./routes/products.js";
import searchRoute from "./routes/search.js";
import priceRoute from "./routes/price.js";
import categoriesRoute from "./routes/categories.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use("/products", productsRoute);
app.use("/search", searchRoute);
app.use("/price", priceRoute);
app.use("/categories", categoriesRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
