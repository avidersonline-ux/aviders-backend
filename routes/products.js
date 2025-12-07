import express from "express";
import ProductIN from "../models/ProductIN.js";
import ProductUS from "../models/ProductUS.js";

const router = express.Router();

function getModel(region) {
  return region === "us" ? ProductUS : ProductIN;
}

// GET product list with pagination
router.get("/", async (req, res) => {
  const { category, region = "in" } = req.query;

  // NEW: pagination params
  const page = parseInt(req.query.page || "1");   // default page 1
  const limit = parseInt(req.query.limit || "50"); // default 50 per page
  const skip = (page - 1) * limit;

  const Model = getModel(region);

  const filter = {};
  if (category) filter.category = category;

  const items = await Model.find(filter)
    .skip(skip)
    .limit(limit);

  // Also return total count so Flutter can know when to stop
  const total = await Model.countDocuments(filter);

  res.json({
    page,
    limit,
    total,
    products: items,
  });
});

// GET single product
router.get("/:id", async (req, res) => {
  const { region = "in" } = req.query;
  const Model = getModel(region);

  const item = await Model.findOne({ id: req.params.id });
  res.json(item);
});

export default router;
