const express = require('express');
const cartRouter = express.Router();
const controller = require("../../../controller/user/cart/cartController");
const checkAuth = require("../../../middleware/auth");
const i18n = require('i18n');



cartRouter.post("/cart",checkAuth.userAuth,controller.createCart);

cartRouter.post("/list-cart",checkAuth.userAuth, controller.listCart);

module.exports = cartRouter;