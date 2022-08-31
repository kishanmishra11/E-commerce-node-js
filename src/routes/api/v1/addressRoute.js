const express = require('express');
const addressRouter = express.Router();
const controller = require('../../../controller/user/address/addressController');
const i18n = require('i18n');
const checkAuth = require("../../../middleware/auth");



addressRouter.post("/address",checkAuth.userAuth,controller.listAddress);

addressRouter.post("/add-edit-address",checkAuth.userAuth,controller.addEditAddress);

addressRouter.post("/view-address",checkAuth.userAuth,controller.viewAddress);

addressRouter.post("/delete-address",checkAuth.userAuth,controller.deleteAddress);

module.exports = addressRouter;