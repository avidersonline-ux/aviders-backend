import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// Get products by category or source
router.get("/", async (req, res) => {
  const { category, source } = req.query;

  let filter = {};
  if (category) filter.category = category;
  if (source) filter.source = source;

  const items = await Product.find(filter).limit(100);
  res.json(items);
});

// Get product detail
router.get("/:id", async (req, res) => {
  const item = await Product.findOne({ id: req.params.id });
  res.json(item);
});

export default router;
