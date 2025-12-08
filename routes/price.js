import express from "express";
import mongoose from "mongoose";

const router = express.Router();
const PriceHistory = mongoose.connection.collection("price_history");

router.get("/:asin", async (req, res) => {
  const asin = req.params.asin;
  const region = req.query.region || "in";

  const history = await PriceHistory
    .find({ asin, region })
    .sort({ date: 1 })
    .toArray();

  return res.json({
    asin,
    region,
    count: history.length,
    history,
  });
});

export default router;
