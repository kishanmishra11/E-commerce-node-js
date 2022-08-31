const express = require('express');
const userRouter = express.Router();
const multer  = require('multer');
const storage = multer.memoryStorage()
const uploads = require("../../middleware/uploadImage");
const controller = require('../../controller/admin/userController');
const i18n = require('i18n');
const checkAuth = require("../../middleware/auth");


userRouter.post("/user",checkAuth.adminAuth,controller.listUser);

userRouter.post("/add-edit-user",checkAuth.adminAuth,uploads.upload.single("profilePicture",storage),checkAuth.adminAuth,controller.addEditUser);

userRouter.post("/view-user",checkAuth.adminAuth,controller.viewUser);

userRouter.post("/delete-user",checkAuth.adminAuth,controller.deleteUser);

module.exports = userRouter;