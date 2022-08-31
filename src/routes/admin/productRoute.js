const express = require('express');
const productRouter = express.Router();
const multer  = require('multer');
const storage = multer.memoryStorage()
const uploads = require("../../middleware/uploadImage");
const controller = require('../../controller/admin/productController');
const i18n = require('i18n');
const checkAuth = require("../../middleware/auth");


// productRouter.post("/add-product",uploads.upload.single("productImage",storage),controller.createProduct);

productRouter.post("/product",checkAuth.adminAuth,controller.listProduct);

productRouter.post("/add-edit-product",checkAuth.adminAuth,uploads.upload.single("productImage",storage),controller.addEditProduct);

productRouter.post("/view-product",checkAuth.adminAuth,controller.viewProduct);

productRouter.post("/delete-product",checkAuth.adminAuth,controller.deleteProduct);

module.exports = productRouter;