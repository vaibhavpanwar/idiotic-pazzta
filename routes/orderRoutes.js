import express from "express";

import {
  addCartItem,
  assignOrder,
  changeOrderStatus,
  getOrderById,
  getUserOrders,
  listAllOrders,
  placeOrder,
} from "../controllers/orderController.js";

const router = express.Router();

import { admin, diliveryAuth, protect } from "../middleware/authMiddleware.js";

router.route("/").get(protect, admin, listAllOrders);

router.route("/additems").post(protect, addCartItem);

router.get("/placeorder", protect, placeOrder);
router.get("/myorders", protect, getUserOrders);
router.get("/mydiliveryorders", protect, diliveryAuth, getUserOrders);
router.route("/change/:id").get(protect, diliveryAuth, changeOrderStatus);

router.post("/:id/assign", protect, admin, assignOrder);
router.route("/:id").get(protect, admin, getOrderById);

export default router;
