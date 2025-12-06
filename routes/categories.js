import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const cats = await Category.find();
  res.json(cats);
});

export default router;
