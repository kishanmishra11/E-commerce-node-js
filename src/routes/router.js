// const express = require('express');
// const router = express.Router();
// const controller = require("../controller/controller");
// const multer  = require('multer');
// const storage = multer.memoryStorage()
// const helper =  require("../helper/helper");
// const checkAuth = require("../middleware/auth");
// const uploads = require("../middleware/uploadImage")
// const { userValidation } = require("../validation/userValidation");
// const { categoryValidation } = require("../validation/categoryValidation");
// const { subCategoryValidation } = require("../validation/subCategoryValidation");
// const { productValidation } = require("../validation/productValidation");
// const { cartValidation } = require("../validation/cartValidation");
// const { adminValidation } = require("../validation/adminValidation");
// // const demoController = require("../controller/demoController");
// const i18n = require('i18n');
//
//
//
// router.get('/',controller.getData)
//
// router.post("/add-category",uploads.upload.single("categoryImage",storage),controller.createCategory);
//
// router.get("/category",controller.listCategory);
//
// router.post("/add-subcategory",uploads.upload.single("subCategoryImage",storage),controller.createSubCategory);
//
// router.get("/subcategory",controller.listSubCategory);
//
// router.post("/add-product",uploads.upload.single("productImage",storage),controller.createProduct);
//
// router.get("/product",controller.listProduct);
//
// router.post("/signup",uploads.upload.single("profilePicture",storage),controller.signUp);
//
// router.post("/user",controller.listUser);
//
// router.post("/login",controller.login);
//
// router.post("/cart",checkAuth.userAuth,controller.createCart);
//
// router.get("/listcart",checkAuth.userAuth, controller.listCart);
//
// router.post("/admin",controller.loginAdmin);
//
// router.post("/edituser",checkAuth.adminAuth,controller.editUser);
//
// // router.get("/demo",checkAuth, demoController.listDemo);
//
// module.exports = router;
