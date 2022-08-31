const express = require('express');
const categoryUserRouter = express.Router();
const controller = require('../../../controller/user/category/category');
const i18n = require('i18n');
const checkAuth = require("../../../middleware/auth");



categoryUserRouter.post("/list-category",controller.listCategory);

categoryUserRouter.post("/view-category",controller.viewCategory);


module.exports = categoryUserRouter;