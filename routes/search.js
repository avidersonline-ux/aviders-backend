import express from "express";
import ProductIN from "../models/ProductIN.js";
import ProductUS from "../models/ProductUS.js";
import mongoose from "mongoose";

const router = express.Router();

// Queue for background indexing handled by aviders-sync
const queue = mongoose.connection.collection("sync_queue");

router.get("/", async (req, res) => {
  const q = req.query.q?.trim();
  const region = req.query.region === "us" ? "us" : "in";

  if (!q) return res.json([]);

  // Select correct product collection
  const Model = region === "us" ? ProductUS : ProductIN;

  // 🔹 Fetch cached results immediately
  const cached = await Model.find({
    title: new RegExp(q, "i"),
  }).limit(50);

  // 🔹 Add keyword to sync queue (processed by aviders-sync)
  await queue.insertOne({
    keyword: q,
    region,
    created_at: new Date(),
  });

  // 🔹 Return cached result to app instantly
  return res.json(cached);
});

export default router;
