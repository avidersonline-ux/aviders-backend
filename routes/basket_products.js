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
 *
 * Query params:
 * - region=in|us        (default: in)
 * - page=1             (default: 1)
 * - limit=20           (default: 20)
 * - category=Honey     (optional, exact match)
 * - search=soap        (optional, title/brand search)
 *
 * HARD RULE:
 * - basketEligible = true ONLY
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

    const pageNum = Math.max(parseInt(page, 10), 1);
    const limitNum = Math.min(parseInt(limit, 10), 100);
    const skip = (pageNum - 1) * limitNum;

    const Model = getModel(region);

    // 🔒 HARD FILTER
    const filter = {
      basketEligible: true,
    };

    // ✅ CATEGORY FILTER (exact match)
    if (category && category !== "All") {
      filter.category = category;
    }

    // ✅ SEARCH FILTER (title OR brand)
    if (search && search.trim().length > 0) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { brand: { $regex: search.trim(), $options: "i" } },
      ];
    }

    // 🔍 QUERY
    const products = await Model.find(filter)
      .sort({ updatedAt: -1 }) // newest first
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Model.countDocuments(filter);

    res.json({
      ok: true,
      region,
      page: pageNum,
      limit: limitNum,
      total,
      products,
    });
  } catch (err) {
    console.error("❌ basket-products error:", err);
    res.status(500).json({
      ok: false,
      error: "Failed to load basket products",
    });
  }
});

export default router;


export default router;
