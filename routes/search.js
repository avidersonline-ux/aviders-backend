import express from "express";
import ProductIN from "../models/ProductIN.js";
import ProductUS from "../models/ProductUS.js";
import { searchAmazon } from "../serpapi_client.js";
import { normalizeProduct } from "../normalize_product.js";
import { saveProduct } from "../save_product.js";
import mongoose from "mongoose";

const router = express.Router();
const searchIndex = mongoose.connection.collection("search_index");

router.get("/", async (req, res) => {
  const q = req.query.q;
  const region = req.query.region || "in";

  if (!q) return res.json([]);

  const Model = region === "us" ? ProductUS : ProductIN;

  // 1. Return existing DB results immediately
  const cached = await Model.find({ title: new RegExp(q, "i") }).limit(50);

  // 2. Check if allowed to run SerpAPI
  const lastRun = await searchIndex.findOne({ keyword: q, region });

  const shouldRefresh =
    !lastRun || Date.now() - lastRun.last_run > 1000 * 60 * 60 * 6;

  if (shouldRefresh) {
    // Update timestamp
    await searchIndex.updateOne(
      { keyword: q, region },
      { $set: { last_run: Date.now() } },
      { upsert: true }
    );

    // Run refresh in background
    (async () => {
      const raw = await searchAmazon(q, region);
      if (raw && raw.length > 0) {
        for (let item of raw) {
          const p = normalizeProduct(item, region);
          await saveProduct(p, region);
        }
      }
    })();
  }

  return res.json(cached);
});

export default router;
