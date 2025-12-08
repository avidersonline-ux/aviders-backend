import express from "express";
import mongoose from "mongoose";

const router = express.Router();
const PriceHistory = mongoose.connection.collection("price_history");

// GET /price-history/:asin
router.get("/:asin", async (req, res) => {
  try {
    const asin = req.params.asin;
    const region = req.query.region || "in";

    const history = await PriceHistory
      .find({ asin, region })
      .sort({ date: 1 })        // oldest → latest
      .toArray();

    return res.json({
      asin,
      region,
      count: history.length,
      history
    });
  } catch (err) {
    console.error("ERROR /price-history:", err);
    return res.status(500).json({ error: "internal error" });
  }
});

export default router;
