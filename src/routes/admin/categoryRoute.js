const express = require('express');
const categoryRouter = express.Router();
const multer  = require('multer');
const storage = multer.memoryStorage()
const uploads = require("../../middleware/uploadImage");
const controller = require('../../controller/admin/categoryController');
const i18n = require('i18n');
const checkAuth = require("../../middleware/auth");



// categoryRouter.post("/add-category",uploads.upload.single("categoryImage",storage),controller.createCategory);

categoryRouter.post("/category",checkAuth.adminAuth,controller.listCategory);

categoryRouter.post("/add-edit-category",checkAuth.adminAuth,uploads.upload.single("categoryImage",storage),controller.addEditCategory);

categoryRouter.post("/view-category",checkAuth.adminAuth,controller.viewCategory);

categoryRouter.post("/delete-category",checkAuth.adminAuth,controller.deleteCategory);

module.exports = categoryRouter;