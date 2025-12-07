import express from "express";
import ProductIN from "../models/ProductIN.js";
import ProductUS from "../models/ProductUS.js";
import mongoose from "mongoose";

const router = express.Router();

// Queue for background indexing handled by aviders-sync
const queue = mongoose.connection.collection("sync_queue");

//
// -------------------------------------------------------
// GET /search — return cached DB results + add to queue
// -------------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const q = req.query.q?.trim();
    const region = req.query.region === "us" ? "us" : "in";

    if (!q) return res.json([]);

    // Choose correct Mongo collection
    const Model = region === "us" ? ProductUS : ProductIN;

    // 1️⃣ Return cached DB results immediately
    const cached = await Model.find({
      title: new RegExp(q, "i"),
    }).limit(50);

    // 2️⃣ Add keyword into sync queue
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
// POST /search/trigger — called by Flutter if no DB results
// -------------------------------------------------------
router.post("/trigger", async (req, res) => {
  try {
    const { keyword, region } = req.body;

    if (!keyword) {
      return res.status(400).json({ error: "keyword required" });
    }

    const reg = region === "us" ? "us" : "in";

    // Insert into the same queue aviders-sync worker reads
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
