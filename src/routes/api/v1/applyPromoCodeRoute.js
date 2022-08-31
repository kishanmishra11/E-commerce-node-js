
const express = require('express');
const applyPromoCodeRouter = express.Router();
const controller = require('../../../controller/user/applyPromoCode/applyPromoCodeController');
const i18n = require('i18n');
const checkAuth = require("../../../middleware/auth");


applyPromoCodeRouter.post("/apply-promocode",checkAuth.userAuth,controller.applyPromo);


module.exports = applyPromoCodeRouter;