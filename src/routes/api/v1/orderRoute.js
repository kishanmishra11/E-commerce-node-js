const express = require('express');
const orderRouter = express.Router();
const controller = require("../../../controller/user/order/orderController");
const stripeController = require("../../../controller/user/order/payment");
const checkAuth = require("../../../middleware/auth");
const i18n = require('i18n');


orderRouter.post("/create-order",checkAuth.userAuth, controller.createOrder);

orderRouter.post("/list-order",checkAuth.userAuth, controller.listOrder);

orderRouter.post("/view-order",checkAuth.userAuth, controller.viewOrder);

orderRouter.post("/track-order",checkAuth.userAuth, controller.trackOrder);

orderRouter.post("/payment",stripeController.payment);

module.exports = orderRouter;