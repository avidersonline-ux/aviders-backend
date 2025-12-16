import express from "express";
import ProductIN from "../models/ProductIN.js";
import ProductUS from "../models/ProductUS.js";

const router = express.Router();

/**
 * Pick model by region
 */
function getModel(region) {
  return region === "us" ? ProductUS : ProductIN;
}

/**
 * GET /basket-products
 * Basket-only products (basketEligible = true)
 *
 * Query params:
 * - region=in|us (default: in)
 * - page (default: 1)
 * - limit (default: 20)
 * - category (optional)
 * - search (optional)
 */
router.get("/", async (req, res) => {
  try {
    const {
      region = "in",
      page = "1",
      limit = "20",
      category,
      search,
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const Model = getModel(region);

    // 🔒 HARD RULE: basketEligible = true
    const filter = {
      basketEligible: true,
    };

    // Optional category filter
    if (category) {
      filter.category = category;
    }

    // Optional search
    if (search && search.trim().length > 0) {
      filter.title = { $regex: search.trim(), $options: "i" };
    }

    const products = await Model.find(filter)
      .sort({ updated_at: -1 }) // newest first
      .skip(skip)
      .limit(limitNum);

    const total = await Model.countDocuments(filter);

    res.json({
      page: pageNum,
      limit: limitNum,
      total,
      products,
    });
  } catch (err) {
    console.error("❌ basket-products error:", err);
    res.status(500).json({ error: "Failed to load basket products" });
  }
});

export default router;
