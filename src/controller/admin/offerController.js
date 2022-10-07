const offerModel = require('../../model/offer');
const helper = require("../../helper/helper");
const offerTransformer = require('../../transformer/adminTransformer/offerTransformer');
const {offerValidation,editOfferValidation} = require('../../validation/adminValidation/offerValidation')
const{
    META_STATUS_0,
    META_STATUS_1,
    SUCCESSFUL,
    VALIDATION_ERROR,
    INTERNAL_SERVER_ERROR,
    ACTIVE,
    INACTIVE,
    DELETED,
} = require('../../../config/key');



//add-edit offer
exports.addEditOffer = async (req,res) => {
    try{
        let reqParam = req.body;
        let offerExist;
        const validationMessage  = await editOfferValidation(reqParam);
        if(validationMessage) return helper.error(res, VALIDATION_ERROR, res.__(validationMessage));
        if(reqParam.offerId) {
             offerExist = await offerModel.findOne({_id: reqParam.offerId, status: {$ne: 3}});
            if (!offerExist) return helper.success(res, res.__("offerNotFound"), META_STATUS_0, SUCCESSFUL);
        }else{
            const validationMessage  = await offerValidation(reqParam);
            if(validationMessage) return helper.error(res, VALIDATION_ERROR, res.__(validationMessage));
            offerExist = new offerModel();
        }
        offerExist.categoryId = reqParam.categoryId ? reqParam.categoryId : offerExist.categoryId;
        offerExist.productId = reqParam.productId ? reqParam.productId : offerExist.productId;
        offerExist.title = reqParam.title ? reqParam.title : offerExist.title;
        offerExist.description = reqParam.description ? reqParam.description : offerExist.description;
        offerExist.amountType = reqParam.amountType ? reqParam.amountType : offerExist.amountType;
        offerExist.amount = reqParam.amount ? reqParam.amount : offerExist.amount;
        offerExist.offerType = req.body.offerType ? reqParam.offerType : offerExist.offerType;
        offerExist.startDate = req.body.startDate ? reqParam.startDate : offerExist.startDate;
        offerExist.endDate = req.body.endDate ? reqParam.endDate : offerExist.endDate;
        offerExist.status = req.body.status ? reqParam.status : offerExist.status;

        const newOffer = await offerExist.save();
        const response = offerTransformer.transformOfferDetails(newOffer);

        if (reqParam.offerId) {
            return helper.success(res,res.__("offerUpdatedSuccessfully"),META_STATUS_1,SUCCESSFUL,response)
        }else{
            return helper.success(res,res.__("offerAddedSuccessfully"),META_STATUS_1,SUCCESSFUL,response)
        }
    } catch(e){
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}

//List Offer
exports.listOffer = async (req,res)=>{
    try{
        const offerList = await offerModel.find({status: ACTIVE});
        const response = offerTransformer.listTransformOfferDetails(offerList)
        return helper.success(res,res.__("offerListedSuccessfully"),META_STATUS_1,SUCCESSFUL,response);
    }catch(e){
        console.log(e)
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}

//List Offer
exports.listOfferAll = async (req,res)=>{
    try{
        const offerList = await offerModel.find();
        const response = offerTransformer.listTransformOfferDetails(offerList)
        return helper.success(res,res.__("offerListedSuccessfully"),META_STATUS_1,SUCCESSFUL,response);
    }catch(e){
        console.log(e)
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}

//view Offer
exports.viewOffer = async (req,res)=>{
    try{
        let reqParam = req.body;
        const offerView = await offerModel.findOne({_id:reqParam.offerId,status: {$ne: 3}});
        const response = offerTransformer.transformOfferDetails(offerView)
        return helper.success(res,res.__("offerDisplayedSuccessfully"),META_STATUS_1,SUCCESSFUL,response);
    }catch(e){
        console.log(e)
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}