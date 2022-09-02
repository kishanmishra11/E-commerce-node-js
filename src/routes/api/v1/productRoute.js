const express = require('express');
const productUserRouter = express.Router();
const controller = require('../../../controller/user/product/productController');
const i18n = require('i18n');
const checkAuth = require("../../../middleware/auth");



productUserRouter.post("/list-product",checkAuth.userAuth,controller.listProduct);

productUserRouter.post("/view-product",checkAuth.userAuth,controller.viewProduct);


module.exports = productUserRouter;