const express = require('express');
const ratingRouter = express.Router();
const controller = require("../../../controller/user/rating/ratingController");
const checkAuth = require("../../../middleware/auth");
const i18n = require('i18n');


ratingRouter.post("/create-rating",checkAuth.userAuth, controller.createRating);

ratingRouter.post("/list-rating", controller.listRating);

module.exports = ratingRouter;