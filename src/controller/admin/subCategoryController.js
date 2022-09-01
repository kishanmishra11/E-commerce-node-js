const SubCategory = require('../../model/subcategory');
const subCategoryTransformerAdmin = require('../../transformer/adminTransformer/subcategoryTransformer');
const subCategoryService = require('../../service/adminService/subcatservice');
const { editSubCategoryValidation, subCategoryValidation } = require("../../validation/adminValidation/editSubCategoryValidation");
const helper = require("../../helper/helper");
const {deleteValidation, deleteSubCategoryValidation} = require("../../validation/adminValidation/deleteSubcategoryValidation");
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



//List subCategory
exports.listSubCategory = async (req,res)=>{
    try{
        //set language
        const lang = req.header('language')
        if(lang) {req.setLocale(lang)}
        //pagination
        let reqParam = req.body;
        const{limitCount,skipCount} = helper.getPageAndLimit(reqParam.page,reqParam.limit);
        const [subCategoryService2] = await subCategoryService.sublistService({skip: skipCount, limit: limitCount,sortBy:reqParam.sortBy,sortKey:reqParam.sortKey,search:reqParam.search})
        const responseData = subCategoryService2 &&  subCategoryService2.data ? subCategoryService2.data : [];
        const totalCount =(subCategoryService2, subCategoryService2.totalRecords &&  subCategoryService2.totalRecords[0] &&  subCategoryService2.totalRecords[0].count);
        const response = subCategoryTransformerAdmin.sublisttransformAddressDetails(responseData, lang)
        return helper.success(res,res.__("subCategoryListedSuccessfully"),META_STATUS_1,SUCCESSFUL,response,{"totalCount":totalCount})
    }catch(e){
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}


//add-edit subCategory
exports.addEditSubCategory = async (req,res) => {
    try{
        const lang = req.header('language')
        if(lang) {req.setLocale(lang)}
        //joi validation
        let subCategoryExist;
        let reqParam = req.body;
        if(reqParam.subCategoryId){
            if(req.file && req.file.filename) reqParam.subCategoryImage = req.file.filename;
            const validationMessage  = await editSubCategoryValidation(reqParam);
            if(validationMessage) return helper.error(res, VALIDATION_ERROR, res.__(validationMessage));
            subCategoryExist = await SubCategory.findOne({_id: reqParam.subCategoryId, status: {$ne: 3}});
            if(!subCategoryExist) return helper.success(res, res.__("subCategoryNotFound"), META_STATUS_0, SUCCESSFUL);
        } else  {
            if(req.file && req.file.filename) reqParam.subCategoryImage = req.file.filename;
            const validationMessage  = await subCategoryValidation(reqParam);
            if(validationMessage) return helper.error(res, VALIDATION_ERROR, res.__(validationMessage));
            subCategoryExist = await SubCategory.findOne({subCategoryName: reqParam.subCategoryName, status: {$ne: 3}});
            if(subCategoryExist) return helper.success(res, res.__("subCategoryAlreadyExists"), META_STATUS_0, SUCCESSFUL);
            subCategoryExist = new SubCategory();
        }
        subCategoryExist.categoryId = reqParam.categoryId ? reqParam.categoryId : subCategoryExist.categoryId;
        subCategoryExist.subCategoryName = reqParam.subCategoryName ? reqParam.subCategoryName : subCategoryExist.subCategoryName;
        subCategoryExist.subCategoryNameGuj = reqParam.subCategoryNameGuj ? reqParam.subCategoryNameGuj : subCategoryExist.subCategoryNameGuj;
        subCategoryExist.subCategoryDescription = reqParam.subCategoryDescription ? reqParam.subCategoryDescription : subCategoryExist.subCategoryDescription;
        subCategoryExist.subCategoryDescriptionGuj = reqParam.subCategoryDescriptionGuj ? reqParam.subCategoryDescriptionGuj : subCategoryExist.subCategoryDescriptionGuj;
        subCategoryExist.subCategoryImage = req.body.subCategoryImage ? reqParam.subCategoryImage : subCategoryExist.subCategoryImage;
        subCategoryExist.status = req.body.status ? reqParam.status : subCategoryExist.status;

        const newsubCategory = await subCategoryExist.save();
        const response = subCategoryTransformerAdmin.subtransformAddressDetails(newsubCategory);
        if (req.body.subCategoryId) {
            return helper.success(res,res.__("subCategoryUpdatedSuccessfully"),META_STATUS_1,SUCCESSFUL,response)
        }else{
            return helper.success(res,res.__("subCategoryAddedSuccessfully"),META_STATUS_1,SUCCESSFUL,response)
        }
    } catch(e){
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}


//view subCategory
exports.viewSubCategory = async (req,res) => {
    try{
        let reqParam = req.body;
        let existingSubCategory = await SubCategory.findOne({_id: reqParam.subCategoryId, status: {$ne: 3}});
        if(!existingSubCategory) return helper.success(res, res.__("subCategoryNotFound"), META_STATUS_0, SUCCESSFUL);
        const response = subCategoryTransformerAdmin.subtransformAddressDetails(existingSubCategory);
        return helper.success(res,res.__("subCategoryFoundSuccessfully"),META_STATUS_1,SUCCESSFUL,response)
    } catch(e){
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}

// delete single/multiple/delete all subCategory
exports.deleteSubCategory = async (req,res) => {
    try{
        let reqParam = req.body
        const validationMessage  = await deleteValidation(req.body);
        if(validationMessage) {
            return helper.error(res, VALIDATION_ERROR, res.__(validationMessage));
        }
        let all = reqParam.all
        if(all===true){
            let deleteSubCategory =  await SubCategory.updateMany({status: {$ne: 3}},{$set:{status:3}});
        }else{
            const validationMessage  = await deleteSubCategoryValidation(req.body);
            if(validationMessage) {
                return helper.error(res, VALIDATION_ERROR, res.__(validationMessage));
            }
            reqParam.subCategoryId = reqParam.subCategoryId.split(",");
            let deleteSubCategory =  await SubCategory.updateMany({_id:{$in:reqParam.subCategoryId}},{$set:{status:3}});
        }
        return helper.success(res,res.__("subCategoryDeletedSuccessFully"), META_STATUS_1,SUCCESSFUL)
    }catch (e) {
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}