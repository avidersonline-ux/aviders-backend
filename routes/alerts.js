const express = require('express');
const router = express.Router();
const PriceAlert = require('../models/Alert');

// POST /price-alerts/subscribe
router.post('/subscribe', async (req, res) => {
  try {
    const { asin, targetPrice, region, email } = req.body;

    if (!asin || !targetPrice || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Upsert the alert (Update if exists, else create)
    const alert = await PriceAlert.findOneAndUpdate(
      { asin, email },
      { targetPrice, region, active: true },
      { upsert: true, new: true }
    );

    console.log(`🎯 Alert set for ${email} on ${asin} at ₹${targetPrice}`);
    res.status(200).json({ message: 'Alert set successfully', alert });
  } catch (err) {
    console.error('❌ Alert Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /price-alerts/unsubscribe
router.post('/unsubscribe', async (req, res) => {
  try {
    const { asin, email } = req.body;
    await PriceAlert.deleteOne({ asin, email });
    res.status(200).json({ message: 'Alert removed' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
