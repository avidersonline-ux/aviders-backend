import express from "express";
import ProductIN from "../models/ProductIN.js";
import ProductUS from "../models/ProductUS.js";

const router = express.Router();

function getModel(region) {
  return region === "us" ? ProductUS : ProductIN;
}

/**
 * GET /shop/categories
 * Categories for SHOP (non-basket products only)
 */
router.get("/", async (req, res) => {
  try {
    const region = req.query.region === "us" ? "us" : "in";
    const Model = getModel(region);

    const categories = await Model.distinct("category", {
      basketEligible: { $ne: true },   // ✅ THIS IS THE RULE
      category: { $ne: null },
    });

    res.json({
      region,
      total: categories.length,
      categories: categories.sort(),
    });
  } catch (err) {
    console.error("❌ shop-categories error:", err);
    res.status(500).json({ error: "Failed to load shop categories" });
  }
});

export default router;
