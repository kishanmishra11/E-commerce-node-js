const express = require('express');
const subCategoryUserRouter = express.Router();
const controller = require('../../../controller/user/subCategory/subCategory');
const i18n = require('i18n');
const checkAuth = require("../../../middleware/auth");



subCategoryUserRouter.post("/list-subcategory",controller.listSubCategory);

subCategoryUserRouter.post("/view-subcategory",controller.viewSubCategory);


module.exports = subCategoryUserRouter;