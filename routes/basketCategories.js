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
 * GET /basket-categories
 * Returns ONLY categories where basketEligible = true
 *
 * Query:
 * - region=in|us (default: in)
 */
router.get("/", async (req, res) => {
  try {
    const { region = "in" } = req.query;
    const Model = getModel(region);

    const categories = await Model.distinct("category", {
      basketEligible: true,
      category: { $exists: true, $ne: "" },
    });

    res.json({
      ok: true,
      total: categories.length,
      categories: categories.sort(),
    });
  } catch (err) {
    console.error("❌ basket-categories error:", err);
    res.status(500).json({
      ok: false,
      error: "Failed to load basket categories",
    });
  }
});

export default router;
