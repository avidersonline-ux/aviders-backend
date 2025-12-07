import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const region = req.query.region === "us" ? "us" : "in";

  const categories = await Category.find({ region }).sort({ name: 1 });

  return res.json({
    region,
    total: categories.length,
    categories,
  });
});

export default router;
