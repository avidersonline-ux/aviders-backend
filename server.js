import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./utils/db.js";

import productsRoute from "./routes/products.js";
import searchRoute from "./routes/search.js";
import priceRoute from "./routes/price.js";
import categoriesRoute from "./routes/categories.js";
import priceHistoryRoute from "./routes/price_history.js";
import basketProductsRoutes from "./routes/basket_products.js";
import basketCategories from "./routes/basketCategories.js";
import shopCategories from "./routes/shopcategories.js";



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
app.use("/price-history", priceHistoryRoute);
app.use("/basket-products", basketProductsRoutes);
app.use("/basket-categories", basketCategories);
app.use("/shopcategories", shopCategories);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
