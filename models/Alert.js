import mongoose from "mongoose";

const AlertSchema = new mongoose.Schema({
  asin: { type: String, required: true, index: true },
  targetPrice: { type: Number, required: true },
  region: { type: String, required: true },
  email: { type: String, required: true, index: true },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

AlertSchema.index({ asin: 1, email: 1 }, { unique: true });

export default mongoose.model('PriceAlert', AlertSchema);
