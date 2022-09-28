const ratingModel = require("../../model/rating");
const ratingTransformer = require("../../transformer/adminTransformer/orderTransformer");
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





exports.listRatingAdmin = async (req,res) => {
    try{
        let reqParam = req.body;
        let existingRating = await ratingModel.find({productId:reqParam.productId});
        if(!existingRating) return helper.success(res, res.__("ratingNotFound"), META_STATUS_0, SUCCESSFUL);
        const response = ratingTransformer.transformRatingData(existingRating);
        return helper.success(res,res.__("ratingListedSuccessfully"),META_STATUS_1,SUCCESSFUL,response)
    } catch(e){
        console.log(e)
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}