const express = require('express');
const userAuthRouter = express.Router();
const controller = require("../../../controller/user/userAuth/userAuthController");
const multer  = require('multer');
const storage = multer.memoryStorage()
const uploads = require("../../../middleware/uploadImage");
const i18n = require('i18n');
const checkAuth = require("../../../middleware/auth");



userAuthRouter.post("/signup",uploads.upload.single("profilePicture",storage),controller.signUp);

userAuthRouter.post("/login",controller.login);

userAuthRouter.post("/change-password",checkAuth.userAuth,controller.changePassword);

module.exports = userAuthRouter;