const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const adminInfo = require("../../model/admin");
const AdminTransformer = require('../../transformer/adminTransformer/adminTransformer');
const { adminValidation } = require("../../validation/adminValidation/adminValidation");

const helper = require("../../helper/helper");
const{
    META_STATUS_0 = 0,
    META_STATUS_1 = 1,
    SUCCESSFUL = 200,
    VALIDATION_ERROR = 400,
    INTERNAL_SERVER_ERROR = 500,
} = require('../../../config/key');


//login Admin
exports.loginAdmin = async (req, res) => {
    try {
        const existingAdmin = await adminInfo.findOne({email: req.body.email});
        if (!existingAdmin) {
            return helper.error(res,VALIDATION_ERROR,res.__("pleaseEnterCorrectEmailAndPassword"))
        }
        const validPassword = await bcrypt.compare(req.body.password, existingAdmin.password);
        if (!validPassword) {
            return helper.error(res,VALIDATION_ERROR, res.__("pleaseEnterCorrectEmailAndPassword"))
        }
        const tokenData = {
            _id: existingAdmin._id,
            adminName: existingAdmin.adminName,
            email: existingAdmin.email,
            phone: existingAdmin.phone,
        }
        const token = jwt.sign(tokenData, "mynameiskishan", {expiresIn: '24h'});
        const response = AdminTransformer.transformAdminDetails(existingAdmin)
        return helper.success(res,res.__("signInSuccessfully"),META_STATUS_1, SUCCESSFUL,response,{"token": token})
    } catch (e) {
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}


