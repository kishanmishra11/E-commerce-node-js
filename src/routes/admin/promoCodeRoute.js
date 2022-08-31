const express = require('express');
const promoCodeRouter = express.Router();
const controller = require('../../controller/admin/promoCodeController');
const i18n = require('i18n');
const checkAuth = require("../../middleware/auth");



promoCodeRouter.post("/promocode",checkAuth.adminAuth,controller.listPromoCode);

promoCodeRouter.post("/add-edit-promocode",checkAuth.adminAuth,controller.addEditPromoCode);

promoCodeRouter.post("/view-promocode",checkAuth.adminAuth,controller.viewPromoCode);

promoCodeRouter.post("/delete-promocode",checkAuth.adminAuth,controller.deletePromoCode);

module.exports = promoCodeRouter;