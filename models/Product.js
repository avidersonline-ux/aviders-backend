import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    id: String,
    title: String,
    brand: String,
    price: Number,
    mrp: Number,
    currency: String,
    category: String,
    stock: String,
    rating: Number,
    reviews: Number,

    image: String,
    images: [String],

    bought_last_month: Number,
    sponsored: Boolean,
    delivery: Array,

    source: String,   // amazon_in or amazon_us
    affiliateUrl: String,

    updated_at: Date,
  },
  { collection: "products_in" } // temporary default
);

export default mongoose.model("Product", ProductSchema);
