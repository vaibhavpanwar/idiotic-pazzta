import asyncHandler from "express-async-handler";

import Item from "../models/itemModel.js";

// @desc    List all items
// @route   POST /api/items
// @access  Public
const listItems = asyncHandler(async (req, res) => {
  const items = await Item.find();
  if (items) {
    res.status(200).json(items);
  } else {
    res.status(404);
    throw new Error("Not found");
  }
});

// @desc    create a new item
// @route   POST /api/items
// @access  admin only
const createItem = asyncHandler(async (req, res) => {
  const { category, locations, name } = req.body;

  const item = await Item.create({
    category,
    locations,
    name,
  });

  if (item) {
    res.status(201).json(item);
  } else {
    res.status(400);
    throw new Error("Invalid data");
  }
});

// @desc    Fetch single item
// @route   GET /api/items/:id
// @access  public
const getItemById = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (item) {
    res.json(item);
  } else {
    res.status(404);
    throw new Error("item not found");
  }
});

// @desc    delete a  item
// @route   delete /api/items/:id
// @access  admin only
const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (item) {
    await item.remove();
    res.json({ message: "Item deleted" });
  } else {
    res.status(400);
    throw new Error("item not found");
  }
});

export { listItems, createItem, deleteItem, getItemById };
