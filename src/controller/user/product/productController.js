const ProductController = require('../../../model/product');
const userModel= require('../../../model/users');
const productTransformer = require('../../../transformer/userTransformer/productTransformer');
const productlistService = require('../../../service/userService/productservice');
const listProductService = require('../../../service/userService/listProductService');
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




//List ProductController
exports.listProduct = async (req,res)=>{
    try{
        let reqParam = req.body;
        let userId = req?.user?._id ? req.user._id : undefined;
        let userData = userId ? await userModel.findOne({_id: userId, status: 1}) : undefined;
        let userType = userData ? userData.userType : undefined;
        const responseData = await listProductService.productlistService({userId: userId,userType: userType});
        const response = productTransformer.listTransformProductDetailsUser(responseData)
        return helper.success(res,res.__("productListedSuccessfully"),META_STATUS_1,SUCCESSFUL,response);
    }catch(e){
        console.log(e)
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}

//view Product
exports.viewProduct = async (req,res) => {
    try{
        let reqParam = req.body;
        let userId = req?.user?._id ? req.user._id : undefined;
        let userData = userId ? await userModel.findOne({_id: userId, status: 1}) : undefined;
        let userType = userData ? userData.userType : undefined;
        let existingProduct = await ProductController.findOne({_id: reqParam.productId, status: {$ne: 3}});
        if(!existingProduct) return helper.success(res, res.__("productNotFound"), META_STATUS_0, SUCCESSFUL);
        const product = await productlistService.productListService({userType: userType, productId:reqParam.productId });
        const response = productTransformer.productTransformCreateUser(existingProduct,product[0]);
        return helper.success(res,res.__("productFoundSuccessfully"),META_STATUS_1,SUCCESSFUL,response)
    } catch(e){
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}