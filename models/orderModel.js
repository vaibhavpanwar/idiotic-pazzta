import mongoose from "mongoose";

const itemSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    qty: { type: Number, required: true, default: 1 },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Item",
    },
    location: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const orderSchema = mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    items: [itemSchema],
    diliveryPersonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    orderStage: {
      type: String,
      required: true,
      default: "initialised",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("order", orderSchema);

export default Order;
