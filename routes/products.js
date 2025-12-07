import express from "express";
import ProductIN from "../models/ProductIN.js";
import ProductUS from "../models/ProductUS.js";

const router = express.Router();

// Helper: choose model based on region
function getModel(region) {
  return region === "us" ? ProductUS : ProductIN;
}

/**
 * GET /products/in or /products/us
 * Optional:
 *  ?q=iphone
 *  ?category=smartphones
 *  ?page=1
 *  ?limit=20
 */
router.get("/:region", async (req, res) => {
  try {
    const { region } = req.params;
    const Model = getModel(region.toLowerCase());

    if (!Model) return res.status(400).json({ error: "Invalid region" });

    const { q, category, page = 1, limit = 20 } = req.query;
    let filter = {};

    // Search
    if (q) {
      filter.title = { $regex: q, $options: "i" };
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const items = await Model.find(filter)
      .sort({ updated_at: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json(items);
  } catch (err) {
    console.error("PRODUCTS API ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET /products/in/:id or /products/us/:id
 */
router.get("/:region/:id", async (req, res) => {
  try {
    const { region, id } = req.params;
    const Model = getModel(region.toLowerCase());

    if (!Model) return res.status(400).json({ error: "Invalid region" });

    const item = await Model.findOne({ id });

    if (!item) return res.json(null);

    res.json(item);
  } catch (err) {
    console.error("PRODUCT DETAIL ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
