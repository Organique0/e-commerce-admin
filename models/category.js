import mongoose, { model, models, Schema } from "mongoose";

const CategorySchema = new Schema({
  name: { type: String, required: true },
  parent: { type: mongoose.Types.ObjectId, required: false, ref: "Category" }
});

export const Category = models?.Category || model("Category", CategorySchema);