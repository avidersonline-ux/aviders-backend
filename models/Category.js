import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  region: { type: String, default: "in" },
  slug: { type: String },
}, { timestamps: true });

// Prevent "OverwriteModelError"
export default mongoose.models.Category || mongoose.model("Category", CategorySchema);
