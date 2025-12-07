import express from "express";
import ProductIN from "../models/ProductIN.js";
import ProductUS from "../models/ProductUS.js";

const router = express.Router();

function getModel(region) {
  return region === "us" ? ProductUS : ProductIN;
}

// Get product list
router.get("/", async (req, res) => {
  const { category, region = "in" } = req.query;

  const Model = getModel(region);

  const filter = {};
  if (category) filter.category = category;

  const items = await Model.find(filter).limit(500);
  res.json(items);
});

// Get single product
router.get("/:id", async (req, res) => {
  const { region = "in" } = req.query;

  const Model = getModel(region);

  const item = await Model.findOne({ id: req.params.id });
  res.json(item);
});

export default router;
