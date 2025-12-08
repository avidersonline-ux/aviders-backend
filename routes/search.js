import express from "express";
import ProductIN from "../models/ProductIN.js";
import ProductUS from "../models/ProductUS.js";
import mongoose from "mongoose";

const router = express.Router();

// Queue collection (used by aviders-sync worker)
const queue = mongoose.connection.collection("sync_queue");

//
// -------------------------------------------------------
// GET /search?q=xxx — return cached + add to sync queue
// -------------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const q = req.query.q?.trim();
    const region = req.query.region === "us" ? "us" : "in";

    if (!q) return res.json([]);

    const Model = region === "us" ? ProductUS : ProductIN;

    // ⭐ IMPROVED SEARCH — match title INCLUDES keyword OR category OR brand
    const cached = await Model.find({
      $or: [
        { title: new RegExp(q, "i") },
        { category: new RegExp(q, "i") },
        { brand: new RegExp(q, "i") }
      ]
    }).limit(50);

    // Add keyword to queue for background indexing
    await queue.insertOne({
      keyword: q,
      region,
      created_at: new Date(),
    });

    return res.json(cached);

  } catch (err) {
    console.error("ERROR in GET /search:", err);
    return res.status(500).json({ error: "internal error" });
  }
});

//
// -------------------------------------------------------
// POST /search/trigger — called by Flutter if no cached results
// -------------------------------------------------------
router.post("/trigger", async (req, res) => {
  try {
    const { keyword, region } = req.body;

    if (!keyword) {
      return res.status(400).json({ error: "keyword required" });
    }

    const reg = region === "us" ? "us" : "in";

    // Insert into sync queue again
    await queue.insertOne({
      keyword,
      region: reg,
      created_at: new Date(),
    });

    return res.json({ status: "queued", keyword, region: reg });

  } catch (err) {
    console.error("ERROR in POST /search/trigger:", err);
    return res.status(500).json({ error: "internal error" });
  }
});

export default router;
