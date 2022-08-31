const Product = require('../../model/product');
const productTransformer = require('../../transformer/protransformer');
const productService = require('../../service/adminService/productservice');
const { editProductValidation, productValidation  } = require("../../validation/adminValidation/editProductValidation");
const helper = require("../../helper/helper");
const {deleteValidation, deleteProductValidation} = require("../../validation/adminValidation/deleteProductValidation");

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


//List Product
exports.listProduct = async (req,res)=>{
    try{
        //set language
        const lang = req.header('language')
        if(lang) {req.setLocale(lang)}
        //pagination
        let reqParam = req.body;
        const{limitCount,skipCount} = helper.getPageAndLimit(reqParam.page,reqParam.limit);
        const [productService2] = await productService.productlistService({skip: skipCount, limit: limitCount,sortBy:reqParam.sortBy,sortKey:reqParam.sortKey,search:reqParam.search,status: reqParam.status})
        const responseData = productService2 &&  productService2.data ? productService2.data : [];
        const totalCount =(productService2, productService2.totalRecords &&  productService2.totalRecords[0] &&  productService2.totalRecords[0].count);
        const response = productTransformer.productlisttransformAddressDetails(responseData,lang)
        return helper.success(res,res.__("productListedSuccessfully"),META_STATUS_1,SUCCESSFUL,response,{"totalCount":totalCount});
    }catch(e){
        console.log(e)
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}


//add-edit Product
exports.addEditProduct = async (req,res) => {
    try{
        const lang = req.header('language')
        if(lang) {req.setLocale(lang)}
        //joi validation
        let reqParam = req.body;
        let productExist
        if(reqParam.productId){
            if(req.file && req.file.filename) reqParam.productImage = req.file.filename;
            const validationMessage  = await editProductValidation(reqParam);
            if(validationMessage) return helper.error(res, VALIDATION_ERROR, res.__(validationMessage));
            productExist = await Product.findOne({_id: reqParam.productId, status: {$ne: 3}});
            if(!productExist) return helper.success(res, res.__("productNotFound"), META_STATUS_0, SUCCESSFUL);
        } else  {
            if(req.file && req.file.filename) reqParam.productImage = req.file.filename;
            const validationMessage  = await productValidation(reqParam);
            if(validationMessage) return helper.error(res, VALIDATION_ERROR, res.__(validationMessage));
            productExist = await Product.findOne({_id: reqParam.productId, status: {$ne: 3}});
            if(productExist) return helper.success(res, res.__("productAlreadyExists"), META_STATUS_0, SUCCESSFUL);
            productExist = new Product();
        }
        productExist.categoryId = req.body.categoryId ? reqParam.categoryId : productExist.categoryId;
        productExist.subCategoryId = req.body.subCategoryId ? reqParam.subCategoryId : productExist.subCategoryId;
        productExist.productName = req.body.productName ? reqParam.productName : productExist.productName;
        productExist.productNameGuj = req.body.productNameGuj ? reqParam.productNameGuj : productExist.productNameGuj;
        productExist.productPrice = req.body.productPrice ? reqParam.productPrice : productExist.productPrice;
        productExist.productDiscount = req.body.productDiscount ? reqParam.productDiscount : productExist.productDiscount;
        productExist.discountedPrice = req.body.discountedPrice ? reqParam.discountedPrice : productExist.discountedPrice;
        productExist.productDescription = req.body.productDescription ? reqParam.productDescription : productExist.productDescription;
        productExist.productDescriptionGuj = req.body.productDescriptionGuj ? reqParam.productDescriptionGuj : productExist.productDescriptionGuj;
        productExist.productImage = req.body.productImage ? reqParam.productImage : productExist.productImage;
        productExist.status = req.body.status ? reqParam.status : productExist.status;
        await productExist.save();
        let discount = {discountedPrice : req.body.productPrice - (req.body.productPrice * req.body.productDiscount/100)};
        let productExist2 = Object.assign(productExist,discount);
        const response = productTransformer.producttransformAddressDetails(productExist2);
        console.log(response);
        if (req.body.productId) {
            return helper.success(res,res.__("productUpdatedSuccessfully"),META_STATUS_1,SUCCESSFUL,response)
        }else{
            return helper.success(res,res.__("productAddedSuccessfully"),META_STATUS_1,SUCCESSFUL,response)
        }
    } catch(e){
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}

//view Product
exports.viewProduct = async (req,res) => {
    try{
        let reqParam = req.body;
        let existingProduct = await Product.findOne({_id: reqParam.productId, status: {$ne: 3}});
        if(!existingProduct) return helper.success(res, res.__("productNotFound"), META_STATUS_0, SUCCESSFUL);
        const response = productTransformer.producttransformAddressDetails(existingProduct);
        return helper.success(res,res.__("productFoundSuccessfully"),META_STATUS_1,SUCCESSFUL,response)
    } catch(e){
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}


// delete single/multiple/delete all Category
exports.deleteProduct = async (req,res) => {
    try{
        let reqParam = req.body
        const validationMessage  = await deleteValidation(req.body);
        if(validationMessage) {
            return helper.error(res, VALIDATION_ERROR, res.__(validationMessage));
        }
        let all = reqParam.all
        if(all===true){
            let deleteProduct =  await Product.updateMany({status: {$ne: 3}},{$set:{status:3}});
        }else{
            const validationMessage  = await deleteProductValidation(req.body);
            if(validationMessage) {
                return helper.error(res, VALIDATION_ERROR, res.__(validationMessage));
            }
            reqParam.productId = reqParam.productId.split(",");
            let deleteProduct =  await Product.updateMany({_id:{$in:reqParam.productId}},{$set:{status:3}});
        }
        return helper.success(res,res.__("productDeletedSuccessFully"), META_STATUS_1,SUCCESSFUL)
    }catch (e) {
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}