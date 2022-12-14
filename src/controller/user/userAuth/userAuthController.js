const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userInfo = require('../../../model/users');
const UserTransformer = require('../../../transformer/userTransformer/userTransformer');
const { userValidation,changePasswordValidation } = require("../../../validation/adminValidation/userValidation");
const helper = require("../../../helper/helper");
const mailer = require("../../../service/adminService/mailer");
const ejs = require('ejs');
const path = require('path');
const {SECRET_KEY} = require('../../../../config/key');
const secret_key = SECRET_KEY;
const referralCodes = require('referral-codes')

const{
    META_STATUS_0,
    META_STATUS_1,
    SUCCESSFUL,
    VALIDATION_ERROR,
    INTERNAL_SERVER_ERROR,
    ACTIVE,
    INACTIVE,
    DELETED,
} = require('../../../../config/key');


//Add User
exports.signUp =  async(req,res)=>{
    try{
        //set language
        const lang = req.header('language')
        if(lang) {req.setLocale(lang)}

        //joi validation
        const validationMessage  = await userValidation(req.body);
        if(validationMessage) {
            return helper.error(res, VALIDATION_ERROR, res.__(validationMessage));
        }
        const userName = await userInfo.findOne({userName: req.body.userName});
        if(userName) return helper.success(res,res.__("userNameAlreadyExists"),META_STATUS_0,SUCCESSFUL);

        const userData = await userInfo.findOne({email: req.body.email});
        if(userData) return helper.success(res,res.__("emailAlreadyExists"),META_STATUS_0,SUCCESSFUL);
        // const userPhone = await userInfo.findOne({phone: req.body.phone});
        // if(userPhone) return helper.success(res,res.__("phoneAlreadyExists"),META_STATUS_0,SUCCESSFUL);

        //add profile picture
        if (req.file && req.file.filename) {req.body.profilePicture = req.file.filename; }

        //bcrypt
        req.body.password = await bcrypt.hashSync(req.body.password,10);

        const referralCodeCreate = referralCodes.generate({
            length: 6,
            charset: referralCodes.charset('alphanumeric'),
        }).toString();
        req.body.referralCode = referralCodeCreate


        let referralCode = await userInfo.findOne({referralCode:req.body.applyReferralCode})
        if(referralCode){
            await userInfo.updateOne({_id:referralCode._id,status:ACTIVE},{$inc:{wallet:100}})
            req.body.wallet = 100
        }
        const user = new userInfo(req.body)
        const createUser = await user.save();

        let locals = {
            userName:req.body.userName,
            email:req.body.email,
            phone:req.body.phone
        }
        let emailBody = await ejs.renderFile(path.join(__dirname,'../../../views/',"home.ejs"),{locals:locals})
        mailer.sendMail(req.body.email,emailBody,"welcome to ecommerce api")
        const response = await UserTransformer.transformUserDetailsUser(createUser)
        return helper.success(res,res.__("userAddedSuccessfully"),META_STATUS_1,SUCCESSFUL,response);
    } catch(e){
        console.log(e)
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}

//login User
exports.login = async (req, res) => {
    try {
        //set language
        const lang = req.header('language')
        if(lang) {req.setLocale(lang)}

        const existingUser = await userInfo.findOne({email: req.body.email});

        let reqParam = req.body;
        let d = new Date();
        let year = d.getFullYear();
        let month = d.getMonth();
        let day = d.getDate();
        let currentDate = new Date(year , month, day);
        let expireDate = new Date(year + 1, month, day);
        let coinCount = existingUser.superCoin - 200;

        if(existingUser.userType === "prime"){
            if(existingUser.primeExpiryDate <= currentDate){
                await userInfo.findOneAndUpdate({email: reqParam.email}, {$set: {userType: "regular"}}, {new: true})
            }
        }else{
            if(existingUser.superCoin > 200){
                await userInfo.findOneAndUpdate({email: reqParam.email}, {$set: {superCoin: coinCount,userType: "prime", primeExpiryDate: expireDate}}, {new: true})
            }
        }


        if (!existingUser) {
            return helper.error(res,VALIDATION_ERROR,res.__("pleaseEnterCorrectEmailAndPassword"))
        }
        const validPassword = await bcrypt.compare(req.body.password, existingUser.password);
        if (!validPassword) {
            return helper.error(res,VALIDATION_ERROR, res.__("pleaseEnterCorrectEmailAndPassword"))
        }

        const tokenData = {
            _id: existingUser._id,
            userName: existingUser.userName,
            email: existingUser.email,
        }
        const token = jwt.sign(tokenData, "mynameiskishan", {expiresIn: '24h'});


        const response = UserTransformer.transformUserDetailsUser(existingUser)
        return helper.success(res,res.__("signInSuccessfully"),META_STATUS_1, SUCCESSFUL,response,{"token": token})
    } catch (e) {
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}


exports.changePassword = async (req, res) => {
    try {
        let reqParam = req.body;
        // let validationMessage = await changePasswordValidation(reqParam);
        // if(validationMessage) return helper.error(res, VALIDATION_ERROR, res.__(validationMessage));

        const foundUser = await userInfo.findOne({_id: req.user._id, status: ACTIVE});
        if (foundUser) {
            //correct password check
            const bcryptMatch = await bcrypt.compare(reqParam.oldPassword, foundUser.password);
            if (bcryptMatch) {
                //hashing new password
                if(reqParam.newPassword === reqParam.oldPassword)
                {
                    return helper.success(res, res.__("oldPasswordAndNewPasswordCannotBeSame"), META_STATUS_0, VALIDATION_ERROR);
                }
                {
                    const newPassword = await bcrypt.hash(reqParam.newPassword, 10);
                    await foundUser.updateOne({password: newPassword});
                    return helper.success(res,res.__("passwordChangedSuccessfully"),META_STATUS_1,SUCCESSFUL);
                }

            } else {
                return helper.error(res,VALIDATION_ERROR, res.__("oldPasswordIsIncorrect"));
            }
        } else {
            return helper.error(res,VALIDATION_ERROR, res.__("userNotFound"));
        }
    } catch (e) {
        console.log(e)
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
};
