import asyncHandler from "express-async-handler";

import Order from "../models/orderModel.js";
import Item from "../models/itemModel.js";
import User from "../models/userModel.js";

// @desc    List all orders
// @route   POST /api/orders
// @access  admin
const listAllOrders = asyncHandler(async (req, res) => {
  const filter = req.query.orderstage;
  if (filter) {
    const filteredOrders = await Order.find({ orderStage: filter }).populate(
      "diliveryPersonId"
    );
    if (filteredOrders) {
      res.status(200).json(filteredOrders);
    } else {
      res.status(404);
      throw new Error("No Found");
    }
  }
  const orders = await Order.find();
  if (orders) {
    res.status(200).json(orders);
  } else {
    res.status(404);
    throw new Error("No Found");
  }
});

// @desc    create cart items for order
// @route   POST /api/orders/additems
// @access  protected user only
const addCartItem = asyncHandler(async (req, res) => {
  const { itemId, qty } = req.body;

  const item = await Item.findOne({ _id: itemId });

  if (item) {
    const { name, category, locations } = item;
    var location = locations[Math.floor(Math.random() * locations?.length)];
    var order = await Order.findOne({ orderStage: "initialised" });

    if (order) {
      const productAlreadyInCart = order.items.find(
        (i) => i?.item.toString() === itemId
      );

      if (productAlreadyInCart) {
        const newItems = order.items.map((element) =>
          element.item.toString() === itemId
            ? { name, qty, item: itemId, location }
            : element
        );
        order.items = newItems;

        await order.save();
        res.status(200).json(order);
      } else {
        order.items = [
          ...order.items,
          {
            name,
            qty,
            item: itemId,
            location,
          },
        ];
        await order.save();
        res.status(200).json(order);
      }
    } else {
      const newOrder = await Order.create({
        customerId: req.user._id,
        orderStage: "initialised",
        items: [
          {
            name,
            qty,
            item: itemId,
            location,
          },
        ],
      });

      if (newOrder) {
        res.status(200).json(newOrder);
      } else {
        res.status(400);
        throw new Error("Invalid data");
      }
    }
  } else {
    res.status(404);
    throw new Error("Item not found");
  }
});

// @desc    Fetch single order
// @route   GET /api/orders/:id
// @access  admin
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("order not found");
  }
});

// @desc    place order
// @route   Get /api/orders/placeorder
// @access  user
const placeOrder = asyncHandler(async (req, res) => {
  var order = await Order.findOne({
    $and: [{ customerId: req.user._id }, { orderStage: "initialised" }],
  });

  if (order) {
    order.orderStage = "orderPlaced";

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("No items in cart");
  }
});

// @desc    assign order to dilivery person
// @route   post /api/orders/:id/assign
// @access  user
const assignOrder = asyncHandler(async (req, res) => {
  var order = await Order.findOne({ _id: req.params.id });

  const { diliveryPersonId } = req.body;

  if (order) {
    if (order.orderStage === "initialised") {
      res.status(400);
      throw new Error("Order not placed yet");
    } else {
      const user = await User.findOne({ _id: diliveryPersonId });
      if (user && user.role === "diliveryPerson") {
        order.diliveryPersonId = diliveryPersonId;

        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
      } else {
        res.status(400);
        throw new Error("User selectod is not a dilivery person");
      }
    }
  } else {
    res.status(404);
    throw new Error("order not found");
  }
});

// @desc    get users order
// @route   Get /api/orders/myorders
// @access  user
const getUserOrders = asyncHandler(async (req, res) => {
  var orders = await Order.find({ customerId: req.user._id });

  if (orders) {
    res.status(200).json(orders);
  } else {
    res.status(404);
    throw new Error("No orders found");
  }
});

// @desc    get dperson orders
// @route   Get /api/orders/mydiliveryorders
// @access  diliveryPerson only
const getdiliveryPersonOrders = asyncHandler(async (req, res) => {
  var orders = await Order.find({ diliveryPersonId: req.user._id });

  if (orders) {
    res.status(200).json(orders);
  } else {
    res.status(404);
    throw new Error("No orders found");
  }
});

// @desc    change placed order status
// @route   Get /api/orders/change/:id
// @access  diliveryPerson only
const changeOrderStatus = asyncHandler(async (req, res) => {
  const status = req.query.status;
  if (!status) {
    res.status(404);
    throw new Error("Please pass status");
  } else {
    var order = await Order.findById(req.params.id);
    if (order) {
      if (req.user.role === "admin") {
        const updatedStatus =
          status === "reachedStore" ||
          status === "itemPicked" ||
          status === "enroute" ||
          status === "dilivered" ||
          status === "cancelled"
            ? status
            : "orderPlaced";
        order.orderStage = updatedStatus;
        await order.save();
        res.status(201).json(order);
      } else {
        console.log(order.diliveryPersonId, req.user._id);
        if (order.diliveryPersonId.toString() === req.user._id.toString()) {
          const updatedStatus =
            status === "reachedStore" ||
            status === "itemPicked" ||
            status === "enroute" ||
            status === "dilivered" ||
            status === "cancelled"
              ? status
              : "orderPlaced";
          order.orderStage = updatedStatus;
          await order.save();
          res.status(201).json(order);
        } else {
          res.status(401);
          throw new Error("Order is not assigned to you");
        }
      }
    } else {
      res.status(404);
      throw new Error("Invalid order passed");
    }
  }
});

export {
  listAllOrders,
  addCartItem,
  getOrderById,
  placeOrder,
  assignOrder,
  getUserOrders,
  getdiliveryPersonOrders,
  changeOrderStatus,
};
