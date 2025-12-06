import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  id: String,                // ASIN
  title: String,
  brand: String,

  price: Number,
  mrp: Number,
  currency: String,

  category: String,
  stock: String,             // in_stock / out_of_stock

  rating: Number,
  reviews: Number,
  bought_last_month: String,

  image: String,
  images: [String],

  variants: Object,          // full variants block
  delivery: [String],        // delivery info

  affiliateUrl: String,
  source: String,            // amazon_in / amazon_us

  updated_at: Date
});

export default mongoose.model("Product", ProductSchema);
