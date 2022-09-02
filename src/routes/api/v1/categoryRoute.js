const express = require('express');
const categoryUserRouter = express.Router();
const controller = require('../../../controller/user/category/categoryController');
const i18n = require('i18n');
const checkAuth = require("../../../middleware/auth");



categoryUserRouter.post("/list-category",checkAuth.userAuth,controller.listCategory);

categoryUserRouter.post("/view-category",checkAuth.userAuth,controller.viewCategory);


module.exports = categoryUserRouter;