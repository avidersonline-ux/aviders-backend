import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  id: String,
  name: String,
  parent: String,
  slug: String
});

export default mongoose.model("Category", CategorySchema);
