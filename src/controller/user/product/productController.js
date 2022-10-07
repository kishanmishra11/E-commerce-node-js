const ProductModel = require('../../../model/product');
const userModel= require('../../../model/users');
const viewCountModel= require('../../../model/viewCount');

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
        const responseData = await listProductService.productlistService({userId: userId,userType: userType, categoryId:reqParam.categoryId,subCategoryId:reqParam.subCategoryId,search:reqParam.search});
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
        let counter = await viewCountModel.findOne({userId:req.user._id, productId:reqParam.productId,countStatus: true});
        if(!counter){
            let viewCount  = new viewCountModel({userId:req.user._id,productId:reqParam.productId,countStatus: true});
             await viewCount.save();
        }
        const count = await viewCountModel.find({productId:reqParam.productId}).countDocuments();
        let existingProduct = await ProductModel.findOneAndUpdate({_id: reqParam.productId, status: {$ne: 3}},{$set:{viewCount:count}});
        if(!existingProduct) return helper.success(res, res.__("productNotFound"), META_STATUS_0, SUCCESSFUL);
        const [product] = await productlistService.productListService({userType: userType, productId:reqParam.productId });
        product.viewCount = count
        const response = productTransformer.productTransformDataUser(product);
        return helper.success(res,res.__("productFoundSuccessfully"),META_STATUS_1,SUCCESSFUL,response)
    } catch(e){
        console.log(e)
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}


exports.highestViewProduct = async (req,res)=>{
    try{
        let reqParam = req.body;
        let existingProduct = await ProductModel.find({viewCount: {$gt:5}});
        const response = productTransformer.listTransformProductDetailsUser(existingProduct);
        return helper.success(res,res.__("productListedSuccessfully"),META_STATUS_1,SUCCESSFUL,response);
    }catch(e){
        console.log(e)
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}