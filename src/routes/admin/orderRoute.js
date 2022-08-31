const express = require('express');
const orderAdminRouter = express.Router();
const controller = require('../../controller/admin/orderController');
const i18n = require('i18n');
const checkAuth = require("../../middleware/auth");



orderAdminRouter.post("/list-order",checkAuth.adminAuth,controller.listOrderAdmin);

orderAdminRouter.post("/view-order",checkAuth.adminAuth,controller.viewOrderAdmin);

orderAdminRouter.post("/edit-order",checkAuth.adminAuth,controller.editOrderAdmin);


module.exports = orderAdminRouter;