import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// dynamic model loader
function getModel(region) {
  const collectionName = region === "us" ? "products_us" : "products_in";

  return mongoose.model(
    `Product_${region}`,
    new mongoose.Schema({}, { strict: false, collection: collectionName })
  );
}

// GET list
router.get("/:region", async (req, res) => {
  const { region } = req.params;
  const { q, category, limit = 50 } = req.query;

  const Model = getModel(region.toLowerCase());

  let filter = {};

  if (q) {
    filter.title = { $regex: q, $options: "i" };
  }
  if (category) {
    filter.category = category;
  }

  const items = await Model.find(filter)
    .sort({ updated_at: -1 })
    .limit(Number(limit));

  res.json(items);
});

// GET detail
router.get("/:region/:id", async (req, res) => {
  const { region, id } = req.params;
  const Model = getModel(region.toLowerCase());

  const item = await Model.findOne({ id });

  res.json(item);
});

export default router;
