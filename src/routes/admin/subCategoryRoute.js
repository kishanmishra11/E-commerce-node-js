const express = require('express');
const subCategoryRouter = express.Router();
const multer  = require('multer');
const storage = multer.memoryStorage()
const uploads = require("../../middleware/uploadImage");
const controller = require('../../controller/admin/subCategoryController');
const i18n = require('i18n');
const checkAuth = require("../../middleware/auth");


subCategoryRouter.post("/subcategory",checkAuth.adminAuth,controller.listSubCategory);

subCategoryRouter.post("/add-edit-subcategory",checkAuth.adminAuth,uploads.upload.single("subCategoryImage",storage),controller.addEditSubCategory);

subCategoryRouter.post("/view-subcategory",checkAuth.adminAuth,controller.viewSubCategory);

subCategoryRouter.post("/delete-subcategory",checkAuth.adminAuth,controller.deleteSubCategory);

module.exports = subCategoryRouter;