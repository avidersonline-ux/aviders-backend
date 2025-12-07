import express from "express";
import ProductIN from "../models/ProductIN.js";
import ProductUS from "../models/ProductUS.js";

const router = express.Router();

// Search products ONLY from MongoDB
router.get("/", async (req, res) => {
  const { q = "", region = "in" } = req.query;

  if (!q.trim()) return res.json([]);

  const Model = region === "us" ? ProductUS : ProductIN;

  const results = await Model.find({
    title: { $regex: q, $options: "i" }
  }).limit(50);

  return res.json(results);
});

export default router;
