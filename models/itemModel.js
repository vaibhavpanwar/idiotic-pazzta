import mongoose from "mongoose";

const itemSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    locations: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model("item", itemSchema);

export default Item;
