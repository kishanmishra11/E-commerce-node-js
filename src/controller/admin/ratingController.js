const ratingModel = require("../../model/rating");
const ratingTransformer = require("../../transformer/adminTransformer/ratingTransformer");

const ratingService = require('../../service/adminService/ratingService')
const helper = require("../../helper/helper");
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




//list rating admin
exports.listRatingAdmin = async (req,res) => {
    try{
        let reqParam = req.body;
        let existingRating = await ratingModel.find({});
        if(!existingRating) return helper.success(res, res.__("ratingNotFound"), META_STATUS_0, SUCCESSFUL);
        const showRating = await ratingService.ratingAdminService({productId:reqParam.productId});
        const response = ratingTransformer.transformRatingAdmin(showRating);
        return helper.success(res,res.__("ratingListedSuccessfully"),META_STATUS_1,SUCCESSFUL,response)
    } catch(e){
        console.log(e)
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}

//view rating
exports.viewRatingAdmin = async (req,res) => {
    try{
        let reqParam = req.body;
        let existingRating = await ratingModel.find({productId: reqParam.productId, status: {$ne: 3}})
        if(!existingRating) return helper.success(res, res.__("ratingNotFound"), META_STATUS_0, SUCCESSFUL);
        const productData = await ratingService.productRating({productId:reqParam.productId});
        const rating = ratingTransformer.transformRatingAdminView(existingRating);
        return helper.success(res,res.__("orderFoundSuccessfully"),META_STATUS_1,SUCCESSFUL, {productData,rating})
    } catch(e){
        console.log(e)
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}