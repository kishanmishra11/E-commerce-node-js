const applyPromoCode = require('../../../model/applyPromoCode');
const promoCode = require('../../../model/promoCode');
const amountService = require('../../../service/userService/amtDataService');
const transformAmtData = require("../../../transformer/amtDataTransformer");
const applyPromoCodeTransformer = require('../../../transformer/applyPromoCodeTransformer');
const helper = require("../../../helper/helper");

const{
    META_STATUS_0 = 0,
    META_STATUS_1 = 1,
    SUCCESSFUL = 200,
    VALIDATION_ERROR = 400,
    INTERNAL_SERVER_ERROR = 500,
    ACTIVE = 1,
    INACTIVE = 2,
    DELETED = 3,
} = require('../../../../config/key');

exports.applyPromo = async (req,res)=>{
    try{
        let reqParam = req.body;
        if (req.user._id) {reqParam.userId = req.user._id};
        if(!reqParam.promoCodeId){
            await applyPromoCode.deleteMany({userId: reqParam.userId, status: {$ne: DELETED} });
            return helper.success(res, res.__("promoCodeDeletedSuccessfully"), META_STATUS_0, SUCCESSFUL);
        }
        const verifyPromoCode = await applyPromoCode.findOne({promoCodeId: reqParam.promoCodeId})
        if(verifyPromoCode) return helper.success(res, res.__("promoCodeAlreadyUsed"), META_STATUS_0, SUCCESSFUL);

        let checkPromo = await promoCode.findOne({_id: reqParam.promoCodeId, status: ACTIVE });
        if(!checkPromo) return helper.success(res, res.__("promoCodeAlreadyUsed"), META_STATUS_0, SUCCESSFUL);
        const currentDate = Date.now();
        const startDate = new Date(checkPromo.startDate).getTime();
        const endDate = new Date(checkPromo.endDate).getTime() + 86399000 ;
        if(currentDate < startDate || currentDate > endDate ){
            return helper.success(res, res.__("promoCodeExpired"), META_STATUS_0, SUCCESSFUL);
        }
        const applyPromo = await applyPromoCode.findOneAndUpdate({userId:reqParam.userId, status:1},{$set: {promoCodeId: reqParam.promoCodeId}},{upsert:true,new:true});
        const verifyPromo = await promoCode.findOne({_id: reqParam.promoCodeId});
        const amtDataServiceData =  await amountService.amtDataService({userId: req.user._id, promoDiscount: verifyPromo.promoDiscount });
        const response = applyPromoCodeTransformer.transformApplyPromoDetails(applyPromo);
        const amountData = transformAmtData.listAmtDataDetails(amtDataServiceData);
        return helper.success(res,res.__("promoCodeAppliedSuccessfully"),META_STATUS_1,SUCCESSFUL,{response,amountData});
    }catch(e){
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}