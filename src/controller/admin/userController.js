const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userInfo = require('../../model/users');
const UserTransformer = require('../../transformer/userTransformer');
const userService = require('../../service/userService/userService');
const { editUserValidation, userValidation } = require("../../validation/adminValidation/editUserValidation");
const helper = require("../../helper/helper");
const {deleteValidation, deleteUserValidation} = require("../../validation/adminValidation/deleteUserValidation");
const{
    META_STATUS_0 = 0,
    META_STATUS_1 = 1,
    SUCCESSFUL = 200,
    VALIDATION_ERROR = 400,
    INTERNAL_SERVER_ERROR = 500,
    ACTIVE = 1,
    INACTIVE = 2,
    DELETED = 3,
} = require('../../../config/key');

//list User
exports.listUser = async (req,res)=>{
    try{
        //set language
        const lang = req.header('language')
        if(lang) {req.setLocale(lang)}
        //pagination
        let reqParam = req.body;
        const{limitCount,skipCount} = helper.getPageAndLimit(reqParam.page,reqParam.limit);
        const [userService2] = await userService.userService({skip: skipCount, status: reqParam.status,limit: limitCount,sortBy:reqParam.sortBy,sortKey:reqParam.sortKey,search:reqParam.search})
        const responseData = userService2 &&  userService2.data ? userService2.data : [];
        const totalCount =(userService2, userService2.totalRecords &&  userService2.totalRecords[0] &&  userService2.totalRecords[0].count);
        const response = UserTransformer.listtransformUserDetails(responseData)
        return helper.success(res,res.__("userListedSuccessfully"),META_STATUS_1,SUCCESSFUL,response,{"totalCount":totalCount});
    }catch(e){
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}

//add-edit User
exports.addEditUser = async (req,res) => {
    try{
        const lang = req.header('language')
        if(lang) {req.setLocale(lang)}
        //joi validation
        let reqParam = req.body;
        let userExist
        if(reqParam.userId){
            if(req.file && req.file.filename) reqParam.profilePicture = req.file.filename;
            const validationMessage  = await editUserValidation(reqParam);
            if(validationMessage) return helper.error(res, VALIDATION_ERROR, res.__(validationMessage));

            userExist = await userInfo.findOne({_id: reqParam.userId, status: {$ne: 3}});
            if(!userExist) return helper.success(res, res.__("userNotFound"), META_STATUS_0, SUCCESSFUL);

            const emailExist = await userInfo.findOne({email: reqParam.email, _id: {$ne: reqParam.userId}, status: {$ne: 3}});
            if(emailExist) return helper.success(res, res.__("emailAlreadyExists"), META_STATUS_0, SUCCESSFUL);
        } else  {
            if(req.file && req.file.filename) reqParam.profilePicture = req.file.filename;
            const validationMessage  = await userValidation(reqParam);
            if(validationMessage) return helper.error(res, VALIDATION_ERROR, res.__(validationMessage));

            userExist = await userInfo.findOne({email: reqParam.email, status: {$ne: 3}});
            if(userExist) return helper.success(res, res.__("emailAlreadyExists"), META_STATUS_0, SUCCESSFUL);


            userExist = new userInfo();
            userExist.password = bcrypt.hashSync(reqParam.password,10);
        }

        userExist.userName = reqParam.userName ? reqParam.userName : userExist.userName;
        userExist.phone = req.body.phone ? reqParam.phone : userExist.phone;
        userExist.email = req.body.email ? reqParam.email : userExist.email;
        userExist.profilePicture = req.body.profilePicture ? reqParam.profilePicture : userExist.profilePicture;
        userExist.status = req.body.status ? reqParam.status : userExist.status;

        const newUser = await userExist.save();
        const response = UserTransformer.transformUserDetails(newUser);
        if (req.body.userId) {
            return helper.success(res,res.__("userUpdatedSuccessfully"),META_STATUS_1,SUCCESSFUL,response)
        }else{
            return helper.success(res,res.__("userAddedSuccessfully"),META_STATUS_1,SUCCESSFUL,response)
        }
    } catch(e){
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}

//view User
exports.viewUser = async (req,res) => {
    try{
        let reqParam = req.body;
        let existingUser = await userInfo.findOne({_id: reqParam.userId, status: {$ne: 3}});
        if(!existingUser) return helper.success(res, res.__("userNotFound"), META_STATUS_0, SUCCESSFUL);
        const response = UserTransformer.transformUserDetails(existingUser);
        return helper.success(res,res.__("userListedSuccessfully"),META_STATUS_1,SUCCESSFUL,response)
    } catch(e){
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}

// delete single/multiple/delete all User
exports.deleteUser = async (req,res) => {
    try{
        let reqParam = req.body
        const validationMessage  = await deleteValidation(req.body);
        if(validationMessage) {
            return helper.error(res, VALIDATION_ERROR, res.__(validationMessage));
        }
        let all = reqParam.all
        if(all===true){
            let deleteUser =  await userInfo.updateMany({status: {$ne: 3}},{$set:{status:3}});
        }else{
            const validationMessage  = await deleteUserValidation(req.body);
            if(validationMessage) {
                return helper.error(res, VALIDATION_ERROR, res.__(validationMessage));
            }
            reqParam.userId = reqParam.userId.split(",");
            let deleteUser =  await userInfo.updateMany({_id:{$in:reqParam.userId}},{$set:{status:3}});
        }
        return helper.success(res,res.__("UserDeletedSuccessFully"), META_STATUS_1,SUCCESSFUL)
    }catch (e) {
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}

