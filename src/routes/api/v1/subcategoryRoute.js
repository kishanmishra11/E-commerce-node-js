const express = require('express');
const subCategoryUserRouter = express.Router();
const controller = require('../../../controller/user/subCategory/subCategoryController');
const i18n = require('i18n');
const checkAuth = require("../../../middleware/auth");



subCategoryUserRouter.post("/list-subcategory",checkAuth.userAuth,controller.listSubCategory);

subCategoryUserRouter.post("/view-subcategory",checkAuth.userAuth,controller.viewSubCategory);


module.exports = subCategoryUserRouter;