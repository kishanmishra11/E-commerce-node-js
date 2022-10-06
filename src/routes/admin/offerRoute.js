const express = require('express');
const offerRouter = express.Router();
const controller = require('../../controller/admin/offerController');
const checkAuth = require("../../middleware/auth");


offerRouter.post("/add-edit-offer",checkAuth.adminAuth,controller.addEditOffer);

offerRouter.post("/list-offer",checkAuth.adminAuth,controller.listOffer);

offerRouter.post("/list-all-offer",checkAuth.adminAuth,controller.listOfferAll);

offerRouter.post("/view-offer",checkAuth.adminAuth,controller.viewOffer);


module.exports = offerRouter;