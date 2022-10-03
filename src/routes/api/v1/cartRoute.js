const express = require('express');
const cartRouter = express.Router();
const controller = require("../../../controller/user/cart/cartController");
const wishListController = require("../../../controller/user/wishList/wishListController");

const checkAuth = require("../../../middleware/auth");
const i18n = require('i18n');



cartRouter.post("/cart",checkAuth.userAuth,controller.createCart);

cartRouter.post("/list-cart",checkAuth.userAuth, controller.listCart);

cartRouter.post("/reorder",checkAuth.userAuth,controller.reorder);

cartRouter.post("/wishlist",checkAuth.userAuth,wishListController.wishList);

module.exports = cartRouter;