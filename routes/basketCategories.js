import express from "express";
import ProductIN from "../models/ProductIN.js";
import ProductUS from "../models/ProductUS.js";

const router = express.Router();

/**
 * GET ALL CATEGORIES (NO PAGINATION)
 * /basket/categories?region=in
 */
router.get("/basket/categories", async (req, res) => {
  try {
    const region = req.query.region || "in";
    const Model = region === "us" ? ProductUS : ProductIN;

    const categories = await Model.aggregate([
      { $group: { _id: "$category" } },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      categories: categories
        .map(c => c._id)
        .filter(Boolean),
    });
  } catch (err) {
    console.error("Category fetch error", err);
    res.status(500).json({ message: "Failed to load categories" });
  }
});

export default router;

