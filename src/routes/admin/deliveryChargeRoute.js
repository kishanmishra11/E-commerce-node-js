const express = require('express');
const deliveryChargeRouter = express.Router();
const controller = require('../../controller/admin/masterController');
const checkAuth = require("../../middleware/auth");



deliveryChargeRouter.post("/edit-deliverycharge",checkAuth.adminAuth,controller.editDeliveryCharge);



module.exports = deliveryChargeRouter;