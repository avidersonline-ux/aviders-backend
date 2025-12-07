import express from "express";
import Category from "../models/Category.js";
import ProductIN from "../models/ProductIN.js";
import ProductUS from "../models/ProductUS.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const region = req.query.region === "us" ? "us" : "in";

  // Correct model based on region
  const ProductModel = region === "us" ? ProductUS : ProductIN;

  // Load categories for region
  const categories = await Category.find({ region }).sort({ name: 1 });

  // Count products inside each category
  const results = [];

  for (const cat of categories) {
    const count = await ProductModel.countDocuments({ category: cat.name });

    results.push({
      name: cat.name,
      slug: cat.slug,
      region,
      count,
    });
  }

  return res.json({
    region,
    total: results.length,
    categories: results,
  });
});

export default router;
