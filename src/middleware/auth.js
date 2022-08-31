const jwt = require('jsonwebtoken');
const Cart = require("../model/cart");
const UserModel = require("../model/users");
const AdminModel = require("../model/admin");
const adminPermissionModel = require('../model/adminPermission');
const helper = require('../helper/helper');



module.exports.userAuth = async (req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','');
        let decode =  await jwt.verify(token, "mynameiskishan");
        if(!decode) return helper.error(res, 400,res.__("TokenExpired"));
        const user = await UserModel.findOne({_id: decode._id});
        if(!user) return helper.error(res,400, res.__("UserNotFound"));
        req.user = user;
        await next();
    }catch(error){
        return helper.error(res,401,res.__("invalidToken"));
    }
}

module.exports.adminAuth = async (req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer','');

        let decode =  await jwt.verify(token, "mynameiskishan");
        if(!decode) return helper.error(res, 400,res.__("tokenExpired"));
        const admin = await AdminModel.findOne({_id: decode._id});
        if(!admin) return helper.error(res,400, res.__("adminNotFound"));
        req.admin = admin;

        if(admin.role !== "superAdmin") {
            const adminPermission = await adminPermissionModel.find({adminId: admin._id, status:1});

            let url = req.baseUrl + req.path;
            url = url.split("/");
            let module = url[url.length - 2]
            let route = url[url.length - 1];
            let value = adminPermission.filter((adminPermissions) => {
                return adminPermissions.module === module ;
            });

            if(value.length === 0 ) return helper.error(res,401,res.__("unAuthorized"));

            value = value[0];
            if(value.route.includes(route) === false) return helper.error(res,401,res.__("unAuthorized"));
       }

        await next();
    }catch(error){
        console.log("err",error);
        return helper.error(res,401,res.__("invalidToken"));
    }
}
