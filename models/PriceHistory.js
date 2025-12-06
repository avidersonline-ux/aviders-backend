import mongoose from "mongoose";

const PriceHistorySchema = new mongoose.Schema({
  id: { type: String, required: true },
  history: [
    {
      date: String,
      price: Number,
    },
  ],
});

export default mongoose.model("PriceHistory", PriceHistorySchema);
