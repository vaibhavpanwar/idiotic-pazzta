import express from "express";
import {
  createItem,
  deleteItem,
  getItemById,
  listItems,
} from "../controllers/itemController.js";
const router = express.Router();

import { admin, protect } from "../middleware/authMiddleware.js";

router.route("/").get(listItems).post(protect, admin, createItem);
router.route("/:id").get(getItemById).delete(protect, admin, deleteItem);

export default router;
