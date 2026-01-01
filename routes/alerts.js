import express from "express";
import PriceAlert from "../models/Alert.js";

const router = express.Router();

router.post("/subscribe", async (req, res) => {
  try {
    const { asin, targetPrice, region, email } = req.body;
    const alert = await PriceAlert.findOneAndUpdate(
      { asin, email },
      { targetPrice, region, active: true },
      { upsert: true, new: true }
    );
    res.status(200).json({ message: "Alert set successfully", alert });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/unsubscribe", async (req, res) => {
  try {
    const { asin, email } = req.body;
    await PriceAlert.deleteOne({ asin, email });
    res.status(200).json({ message: "Alert removed" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
