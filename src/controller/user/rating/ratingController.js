const ratingModel = require('../../../model/rating');
const SubOrderModel = require('../../../model/subOrder');
const orderModel = require('../../../model/order');
const ratingTransformer = require('../../../transformer/userTransformer/ratingTransformer');
const productTransformer = require('../../../transformer/userTransformer/productTransformer');
const ratingService = require('../../../service/userService/ratingService')
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


exports.createRating = async (req,res) => {
    try {
        let reqParam = req.body;

        const orderExist = await SubOrderModel.findOne({ productId: reqParam.productId, status: ACTIVE});
        const checkOrderStatus  = await orderModel.findOne({_id: orderExist.orderId})
        if(checkOrderStatus.orderStatus === "delivered"){
            if(!orderExist) return helper.success(res, res.__("youHaveNotPurchasedThisProduct"), META_STATUS_0, SUCCESSFUL);
            let ratingFind = await ratingModel.findOne({
                userId : req.user._id,
                productId: reqParam.productId,
                status: {$in:[ACTIVE,INACTIVE]}
            })
            if(ratingFind)  return helper.success(res, res.__("ratingAlreadyExist"), META_STATUS_0, SUCCESSFUL);

            let newRating = new ratingModel({
                productId: reqParam.productId,
                userId: req.user._id,
                title: reqParam.title,
                comment: reqParam.comment,
                star: reqParam.star
            })

            const ratingSave = await newRating.save();
            return helper.success(res,res.__("ratingAddedSuccessfully"),META_STATUS_1,SUCCESSFUL,ratingSave)
        }else{
            return helper.success(res, res.__("youHaveNotPurchasedThisProduct"), META_STATUS_0, SUCCESSFUL);
        }
    }catch (e) {
        console.log(e)
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}

//list Rating
exports.listRating = async (req,res) => {
    try{
        let reqParam = req.body;
        let existingRating = await ratingModel.find({productId:reqParam.productId});
        if(!existingRating) return helper.success(res, res.__("ratingNotFound"), META_STATUS_0, SUCCESSFUL);
        const productData = await ratingService.productRating({productId:reqParam.productId})
        const rating = productTransformer.reviewproductTransformDataUser(productData);
        return helper.success(res,res.__("ratingListedSuccessfully"),META_STATUS_1,SUCCESSFUL,rating)
    } catch(e){
        console.log(e)
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}
