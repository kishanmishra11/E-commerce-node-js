const express = require('express');
const router = express.Router();
const controller = require("../controller/controller");
const multer  = require('multer');
const storage = multer.memoryStorage()
const helper =  require("../helper/helper");
const checkAuth = require("../middleware/auth");
const uploads = require("../middleware/uploadImage")
const { validateSignup } = require("../validation/adminValidation/userValidation");
const { validateCategory } = require("../validation/adminValidation/categoryValidation");
const { validateSubCategory } = require("../validation/adminValidation/subCategoryValidation");
const { validateProduct } = require("../validation/adminValidation/productValidation");
const { validateCart } = require("../validation/userValidation/cartValidation");
const demoController = require("../controller/demoController");
const demoService = require("../service/demoService");
const transformDemoData = require("../transformer/demoTransformer");


router.get("/demo",checkAuth.userAuth, demoController.listDemo);

module.exports = router;
