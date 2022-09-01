const config = require("../../model/config");
const helper = require("../../helper/helper");
const deliveryChargeTransformer = require("../../transformer/adminTransformer/deliveryChargeTransformer");
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




// edit deliveryCharge
exports.editDeliveryCharge = async (req,res) => {
    try{
        let reqParam = req.body;
        let deliveryCharge = await config.findOne({deliveryChargeId: reqParam.deliveryChargeId, status: {$ne: 3}});
        if(!deliveryCharge) return helper.success(res, res.__("dataNotFound"), 0, 200);
        deliveryCharge.deliveryCharge = reqParam.deliveryCharge
        deliveryCharge.status = reqParam.status
        await deliveryCharge.save();
        const response = deliveryChargeTransformer.transformDeliveryChargeDetails(deliveryCharge);
        return helper.success(res,res.__("deliveryChargeUpdatedSuccessfully"),1,200,response)
    } catch(e){
        return helper.error(res,500,res.__("somethingWentWrong"));
    }
}