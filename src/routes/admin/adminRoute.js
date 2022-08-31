const express = require('express');
const adminRouter = express.Router();
const controller = require('../../controller/admin/adminController');




adminRouter.post("/admin",controller.loginAdmin);



module.exports = adminRouter;