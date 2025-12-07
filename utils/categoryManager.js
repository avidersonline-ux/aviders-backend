import Category from "../models/Category.js";

export async function ensureCategoryExists(name, region = "in") {
  if (!name) return;

  await Category.updateOne(
    { name: name.toLowerCase(), region },
    {
      $set: {
        name: name.toLowerCase(),
        region,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
      }
    },
    { upsert: true }
  );
}
