const Product = require('../../model/product');
const productPriceListModel = require('../../model/productPriceList');
const userInfo = require('../../model/users');
const productTransformerAdmin = require('../../transformer/adminTransformer/productTransformer');
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

        // const startingMinutes = 10;
        // let time = startingMinutes * 60;
        // const countDown = document.getElementById('count');
        // setInterval(updateCountDown,1000);
        // function updateCountDown(){
        //     const minutes = Math.floor(time/60);
        //     let seconds = time % 60;
        //     seconds = seconds < 10 ? '0' + seconds :seconds;
        //     countDown.innerHTML = `${minutes}:${seconds}`;
        //     time--;
        // }

        const response = productTransformerAdmin.productlisttransformAddressDetails(responseData,lang)
        return helper.success(res,res.__("productListedSuccessfully"),META_STATUS_1,SUCCESSFUL,response,{"totalCount":totalCount});
    }catch(e){
        console.log(e)
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}


//add-edit Product
exports.addEditProduct = async (req,res) => {
    try {
        const lang = req.header('language')
        if (lang) {
            req.setLocale(lang)
        }
        //joi validation
        let reqParam = req.body;
        let productExist
        let productPriceData
        let productExist2
        let productPriceData2

        // let user = await userInfo.findOne({userId:reqParam._id})
        // console.log(user)
        if (reqParam.productId) {
            if (req.file && req.file.filename) {reqParam.productImage = req.file.filename};
            const validationMessage = await editProductValidation(reqParam);
            if (validationMessage) return helper.error(res, VALIDATION_ERROR, res.__(validationMessage));

            productExist = await Product.findOne({_id: reqParam.productId, status: {$ne: 3}});
            if (!productExist) return helper.success(res, res.__("productNotFound"), META_STATUS_0, SUCCESSFUL);

            if (reqParam.productPriceListId) {
                productPriceData = await productPriceListModel.findOne({colorName: reqParam.colorName});
                if (productPriceData) return helper.success(res, res.__("productColorAlreadyExists"), META_STATUS_0, SUCCESSFUL);
            } else {
                productPriceData2 = await productPriceListModel.findOne({productId:reqParam.productId,colorName: reqParam.colorName});
                if (productPriceData2) return helper.success(res, res.__("productColorAlreadyExists"), META_STATUS_0, SUCCESSFUL);
                productPriceData = new productPriceListModel();
            }

        } else  {
            if(req.file && req.file.filename) reqParam.productImage = req.file.filename;
            const validationMessage  = await productValidation(reqParam);
            if(validationMessage) return helper.error(res, VALIDATION_ERROR, res.__(validationMessage));
            productExist = await Product.findOne({productName: reqParam.productName, status: {$ne: 3}});
            if(productExist) return helper.success(res, res.__("productAlreadyExists"), META_STATUS_0, SUCCESSFUL);

            productExist = new Product();

            if (reqParam.productPriceListId) {
                productPriceData = await productPriceListModel.findOne({colorName: reqParam.colorName});
                if (productPriceData) return helper.success(res, res.__("productColorAlreadyExists"), META_STATUS_0, SUCCESSFUL);
            } else {
                productPriceData2 = await productPriceListModel.findOne({productId:reqParam.productId,colorName: reqParam.colorName});
                if (productPriceData2) return helper.success(res, res.__("productColorAlreadyExists"), META_STATUS_0, SUCCESSFUL);
                productPriceData = new productPriceListModel();
            }
        }

        productExist.categoryId = req.body.categoryId ? reqParam.categoryId : productExist.categoryId;
        productExist.subCategoryId = req.body.subCategoryId ? reqParam.subCategoryId : productExist.subCategoryId;
        productExist.productName = req.body.productName ? reqParam.productName : productExist.productName;
        productExist.productNameGuj = req.body.productNameGuj ? reqParam.productNameGuj : productExist.productNameGuj;
        productExist.regularDiscount = req.body.regularDiscount ? reqParam.regularDiscount : productExist.regularDiscount;
        productExist.primeDiscount = req.body.primeDiscount ? reqParam.primeDiscount : productExist.primeDiscount;
        productExist.totalPrimeDiscount = productExist.regularDiscount + productExist.primeDiscount;
        productExist.productDescription = req.body.productDescription ? reqParam.productDescription : productExist.productDescription;
        productExist.productDescriptionGuj = req.body.productDescriptionGuj ? reqParam.productDescriptionGuj : productExist.productDescriptionGuj;
        productExist.productImage = req.body.productImage ? reqParam.productImage : productExist.productImage;
        productExist.status = req.body.status ? reqParam.status : productExist.status;


        if(reqParam.productId){
            productPriceData.productId = req.body.productId ? reqParam.productId : productPriceData.productId;
        }else{
            productPriceData.productId = productExist._id
        }
        productPriceData.colorName = req.body.colorName ? reqParam.colorName : productPriceData.colorName;
        productPriceData.stock = req.body.stock ? reqParam.stock : productPriceData.stock;
        productPriceData.price = req.body.price ? reqParam.price : productPriceData.price;
        productPriceData.regularDiscountedPrice = productPriceData.price -((productPriceData.price * productExist.regularDiscount)/100);
        productPriceData.primeDiscountedPrice = productPriceData.price -((productPriceData.price * productExist.totalPrimeDiscount)/100);
        productPriceData.status = req.body.status ? reqParam.status : productPriceData.status;


        await productExist.save();
        await productPriceData.save();

        const response = productTransformerAdmin.producttransformAddressDetails(productExist);
        const productPriceList = productTransformerAdmin.productlisttransformAddressDetails(productPriceData)

        if (req.body.productId) {
            return helper.success(res,res.__("productUpdatedSuccessfully"),META_STATUS_1,SUCCESSFUL,{response,productPriceList})
        }else{
            return helper.success(res,res.__("productAddedSuccessfully"),META_STATUS_1,SUCCESSFUL,{response,productPriceList})
        }
    } catch(e){
        console.log(e)
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}



//view Product
exports.viewProduct = async (req,res) => {
    try{
        let reqParam = req.body;
        let existingProduct = await Product.findOne({_id: reqParam.productId, status: {$ne: 3}});
        if(!existingProduct) return helper.success(res, res.__("productNotFound"), META_STATUS_0, SUCCESSFUL);
        let productPriceData = await productPriceListModel.find({productId:reqParam.productId});
        const response = productTransformerAdmin.producttransformAddressDetails(existingProduct);
        const productPriceList = productTransformerAdmin.productPriceListTransformData(productPriceData)
        return helper.success(res,res.__("productFoundSuccessfully"),META_STATUS_1,SUCCESSFUL,{response,productPriceList})
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