import express from "express";
import PriceHistory from "../models/PriceHistory.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
  const history = await PriceHistory.findOne({ id: req.params.id });
  res.json(history || { id: req.params.id, history: [] });
});

export default router;
