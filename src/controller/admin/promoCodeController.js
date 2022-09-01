const promoCode = require('../../model/promoCode');
const promoCodeTransformer = require('../../transformer/adminTransformer/promoCodeTransformer');
const { editPromoValidation, promoCodeValidation  } = require("../../validation/adminValidation/promoCodeValidation");
const helper = require("../../helper/helper");
const {deleteValidation, deletePromoCodeValidation} = require("../../validation/adminValidation/deletePromoCodeValidation");

const{
    META_STATUS_0 = 0,
    META_STATUS_1 = 1,
    SUCCESSFUL = 200,
    VALIDATION_ERROR = 400,
    INTERNAL_SERVER_ERROR = 500,
} = require('../../../config/key');



//List PromoCode
exports.listPromoCode = async (req,res)=>{
    try{
        //set language
        const lang = req.header('language')
        if(lang) {req.setLocale(lang)};
        const promoCodeList = await promoCode.find();
        const response = promoCodeTransformer.listTransformPromoDetails(promoCodeList,lang)
        return helper.success(res,res.__("promoCodeListedSuccessfully"),META_STATUS_1,SUCCESSFUL,response);
    }catch(e){
        console.log(e)
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}

//add-edit PromoCode
exports.addEditPromoCode = async (req,res) => {
    try{
        const lang = req.header('language')
        if(lang) {req.setLocale(lang)}
        //joi validation
        let reqParam = req.body;
        let promoCodeExist
        if(reqParam.promoCodeId){
            const validationMessage  = await editPromoValidation(reqParam);
            if(validationMessage) return helper.error(res, VALIDATION_ERROR, res.__(validationMessage));

            promoCodeExist = await promoCode.findOne({_id: reqParam.promoCodeId, status: {$ne: 3}});
            if(!promoCodeExist) return helper.success(res, res.__("promoCodeNotFound"), META_STATUS_0, SUCCESSFUL);
        } else  {
            const validationMessage  = await promoCodeValidation(reqParam);
            if(validationMessage) return helper.error(res, VALIDATION_ERROR, res.__(validationMessage));

            promoCodeExist = await promoCode.findOne({promoCodeName: reqParam.promoCodeName, status: {$ne: 3}});
            if(promoCodeExist) return helper.success(res, res.__("promoCodeAlreadyExists"), META_STATUS_0, SUCCESSFUL);

            promoCodeExist = new promoCode();
        }

        promoCodeExist.promoCodeId = req.body.promoCodeId ? reqParam.promoCodeId : promoCodeExist.promoCodeId;
        promoCodeExist.promoCodeName = req.body.promoCodeName ? reqParam.promoCodeName : promoCodeExist.promoCodeName;
        promoCodeExist.promoCodeNameGuj = req.body.promoCodeNameGuj ? reqParam.promoCodeNameGuj : promoCodeExist.promoCodeNameGuj;
        promoCodeExist.promoDiscount = req.body.promoDiscount ? reqParam.promoDiscount : promoCodeExist.promoDiscount;
        promoCodeExist.startDate = req.body.startDate ? reqParam.startDate : promoCodeExist.startDate;
        promoCodeExist.endDate = req.body.endDate ? reqParam.endDate : promoCodeExist.endDate;
        promoCodeExist.status = req.body.status ? reqParam.status : promoCodeExist.status;

        const newPromoCode = await promoCodeExist.save();
        const response = promoCodeTransformer.transformPromoDetails(newPromoCode);
        if (req.body.promoCodeId) {
            return helper.success(res,res.__("promoCodeUpdatedSuccessfully"),META_STATUS_1,SUCCESSFUL,response)
        }else{
            return helper.success(res,res.__("promoCodeAddedSuccessfully"),META_STATUS_1,SUCCESSFUL,response)
        }
    } catch(e){
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}

//view PromoCode
exports.viewPromoCode = async (req,res) => {
    try{
        let reqParam = req.body;
        let existingPromoCode = await promoCode.findOne({_id: reqParam.promoCodeId, status: {$ne: 3}});
        if(!existingPromoCode) return helper.success(res, res.__("promoCodeNotFound"), META_STATUS_0, SUCCESSFUL);
        const response = promoCodeTransformer.transformPromoDetails(existingPromoCode);
        return helper.success(res,res.__("promoCodeFoundSuccessfully"),META_STATUS_1,SUCCESSFUL,response)
    } catch(e){
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}


// delete single/multiple/delete all PromoCode
exports.deletePromoCode = async (req,res) => {
    try{
        let reqParam = req.body
        const validationMessage  = await deleteValidation(req.body);
        if(validationMessage) {
            return helper.error(res, VALIDATION_ERROR, res.__(validationMessage));
        }
        let all = reqParam.all
        if(all===true){
            let deletePromoCode =  await promoCode.updateMany({status: {$ne: 3}},{$set:{status:3}});
        }else{
            const validationMessage  = await deletePromoCodeValidation(req.body);
            if(validationMessage) {
                return helper.error(res, VALIDATION_ERROR, res.__(validationMessage));
            }
            reqParam.promoCodeId = reqParam.promoCodeId.split(",");
            let deletePromoCode =  await promoCode.updateMany({_id:{$in:reqParam.promoCodeId}},{$set:{status:3}});
        }
        return helper.success(res,res.__("promoCodeDeletedSuccessFully"), META_STATUS_1,SUCCESSFUL)
    }catch (e) {
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}