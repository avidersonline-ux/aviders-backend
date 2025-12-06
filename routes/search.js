import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const q = req.query.q;

  const items = await Product.find({
    title: { $regex: q, $options: "i" },
  }).limit(50);

  res.json(items);
});

export default router;
