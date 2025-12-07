iimport express from "express";
import ProductIN from "../models/ProductIN.js";
import ProductUS from "../models/ProductUS.js";

const router = express.Router();

function getModel(region) {
  return region === "us" ? ProductUS : ProductIN;
}

// ------------------------------
// SEARCH FROM DATABASE ONLY
// ------------------------------
router.get("/", async (req, res) => {
  const { q = "", region = "in" } = req.query;

  if (!q.trim()) {
    return res.json([]);
  }

  const Model = getModel(region);

  // Simple text search
  const items = await Model.find({
    title: { $regex: q, $options: "i" }
  })
  .limit(50);

  res.json(items);
});

export default router;


export default router;
