const express = require('express');
const userAuthRouter = express.Router();
const controller = require("../../../controller/user/userAuth/userAuthController");
const multer  = require('multer');
const storage = multer.memoryStorage()
const uploads = require("../../../middleware/uploadImage");
const i18n = require('i18n');


userAuthRouter.post("/signup",uploads.upload.single("profilePicture",storage),controller.signUp);

userAuthRouter.post("/login",controller.login);

module.exports = userAuthRouter;