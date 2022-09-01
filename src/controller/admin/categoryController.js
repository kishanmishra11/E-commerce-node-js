const Category = require('../../model/category');
const categoryTransformerAdmin = require('../../transformer/adminTransformer/categoryTransformer');
const categoryService = require('../../service/adminService/categoryservice');
const {editCategoryValidation , categoryValidation}  = require("../../validation/adminValidation/editCategoryValidation");
const helper = require("../../helper/helper");
const {deleteValidation, deleteCategoryValidation} = require("../../validation/adminValidation/deleteCategoryValidation");
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



//Add category
// exports.createCategory =  async(req,res)=>{
//     try{
//         //set language
//         const lang = req.header('language');
//         if(lang) {req.setLocale(lang)}
//         //joi validation
//         const validationMessage  = await categoryValidation(req.body);
//         if(validationMessage) {
//             return helper.error(res, 400, res.__(validationMessage));
//         }
//         //categoryImage
//         if (req.file && req.file.filename) {req.body.categoryImage = req.file.filename; }
//         //create new category
//         const category = new Category(req.body);
//         const categoryExists = await Category.findOne({categoryName : req.body.categoryName});
//         if(categoryExists){ return helper.success(res,res.__("categoryAlreadyExists"),0,200,);}
//         const createCategory = await category.save();
//         const response = transformer.transformAddressDetails(createCategory)
//         return helper.success(res,res.__("categoryAddedSuccessfully"),1,200,response);
//     } catch(e){
//
//         return helper.error(res,500,res.__("somethingWentWrong"));
//     }
// }

//List Category
exports.listCategory = async (req,res)=>{
    try{
        //set language
        const lang = req.header('language')
        if(lang) {req.setLocale(lang)}

        //pagination
        let reqParam = req.body;
        const{limitCount,skipCount} = helper.getPageAndLimit(reqParam.page,reqParam.limit);
        const [categoryService2] = await categoryService.categoryService({skip: skipCount, limit: limitCount,sortBy:reqParam.sortBy,sortKey:reqParam.sortKey, search:reqParam.search})
        const responseData = categoryService2 &&  categoryService2.data ? categoryService2.data : [];
        const totalCount =(categoryService2, categoryService2.totalRecords &&  categoryService2.totalRecords[0] &&  categoryService2.totalRecords[0].count);
        const response = categoryTransformerAdmin.listtransformAddressDetails(responseData, lang)
        return helper.success(res,res.__("categoryListedSuccessfully"),META_STATUS_1,SUCCESSFUL,response,{"totalCount":totalCount});
    }catch(e){
        console.log(e)
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}


//edit Category
// exports.editCategory = async (req,res) => {
//     try{
//         //joi validation
//         const validationMessage  = await editCategoryValidation(req.body);
//         if(validationMessage) {
//             return helper.error(res, 400, res.__(validationMessage));
//         }
//         let reqParam = req.body;
//         let existingCategory = await Category.findOne({_id: reqParam.categoryId, status: {$ne: 3}});
//         if(!existingCategory) return helper.success(res, res.__("categoryNotFound"), 0, 200);
//         if (req.file && req.file.filename) {req.body.categoryImage = req.file.filename; }
//         existingCategory.categoryName = req.body.categoryName ? reqParam.categoryName : existingCategory.categoryName;
//         existingCategory.categoryNameGuj = req.body.categoryNameGuj ? reqParam.categoryNameGuj : existingCategory.categoryNameGuj;
//         existingCategory.categoryDescription = req.body.categoryDescription ? reqParam.categoryDescription : existingCategory.categoryDescription;
//         existingCategory.categoryDescriptionGuj = req.body.categoryDescriptionGuj ? reqParam.categoryDescriptionGuj : existingCategory.categoryDescriptionGuj;
//         existingCategory.categoryImage = req.body.categoryImage ? reqParam.categoryImage : existingCategory.categoryImage;
//         existingCategory.status = req.body.status ? reqParam.status : existingCategory.status;
//         await existingCategory.save();
//         const response = transformer.transformAddressDetails(existingCategory);
//         return helper.success(res,res.__("categoryUpdatedSuccessfully"),1,200,response)
//     } catch(e){
//         return helper.error(res,500,res.__("somethingWentWrong"));
//     }
// }

//add-edit Category
exports.addEditCategory = async (req,res) => {
    try{
        const lang = req.header('language')
        if(lang) {req.setLocale(lang)}
        //joi validation
        let categoryExist;
        let reqParam = req.body;
        if(reqParam.categoryId){
            if(req.file && req.file.filename) reqParam.categoryImage = req.file.filename;
            const validationMessage  = await editCategoryValidation(reqParam);
            if(validationMessage) return helper.error(res, VALIDATION_ERROR, res.__(validationMessage));

            categoryExist = await Category.findOne({_id: reqParam.categoryId, status: {$ne: 3}});
            if(!categoryExist) return helper.success(res, res.__("categoryNotFound"), META_STATUS_0, SUCCESSFUL);

        } else  {
            if(req.file && req.file.filename) reqParam.categoryImage = req.file.filename;
            const validationMessage  = await categoryValidation(reqParam);
            if(validationMessage) return helper.error(res, VALIDATION_ERROR, res.__(validationMessage));

            categoryExist = await Category.findOne({categoryName: reqParam.categoryName, status: {$ne: 3}});
            if(categoryExist) return helper.success(res, res.__("categoryAlreadyExists"), META_STATUS_0, SUCCESSFUL);

            categoryExist = new Category();
        }

        categoryExist.categoryName = reqParam.categoryName ? reqParam.categoryName : categoryExist.categoryName;
        categoryExist.categoryNameGuj = reqParam.categoryNameGuj ? reqParam.categoryNameGuj : categoryExist.categoryNameGuj;
        categoryExist.categoryDescription = reqParam.categoryDescription ? reqParam.categoryDescription : categoryExist.categoryDescription;
        categoryExist.categoryDescriptionGuj = reqParam.categoryDescriptionGuj ? reqParam.categoryDescriptionGuj : categoryExist.categoryDescriptionGuj;
        categoryExist.categoryImage = reqParam.categoryImage ? reqParam.categoryImage : categoryExist.categoryImage;
        categoryExist.status = req.body.status ? reqParam.status : categoryExist.status;

        const newCategory = await categoryExist.save();
        const response = categoryTransformerAdmin.transformAddressDetails(newCategory);

        if (req.body.categoryId) {
            return helper.success(res,res.__("categoryUpdatedSuccessfully"),META_STATUS_1,SUCCESSFUL,response)
        }else{
            return helper.success(res,res.__("categoryAddedSuccessfully"),META_STATUS_1,SUCCESSFUL,response)
        }
    } catch(e){
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}


//view Category
exports.viewCategory = async (req,res) => {
    try{
        let reqParam = req.body;
        let existingCategory = await Category.findOne({_id: reqParam.categoryId, status: {$ne: 3}});
        if(!existingCategory) return helper.success(res, res.__("categoryNotFound"), META_STATUS_0, SUCCESSFUL);
        const response = categoryTransformerAdmin.transformAddressDetails(existingCategory);
        return helper.success(res,res.__("categoryFoundSuccessfully"),META_STATUS_1,SUCCESSFUL,response)
    } catch(e){
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}


// delete single/multiple/delete all Category
exports.deleteCategory = async (req,res) => {
    try{
        let reqParam = req.body
        const validationMessage  = await deleteValidation(req.body);
        if(validationMessage) {
            return helper.error(res, VALIDATION_ERROR, res.__(validationMessage));
        }
        let all = reqParam.all
        if(all===true){
            let deleteCategory =  await Category.updateMany({status: {$ne: 3}},{$set:{status:3}});
        }else{
            const validationMessage  = await deleteCategoryValidation(req.body);
            if(validationMessage) {
                return helper.error(res, VALIDATION_ERROR, res.__(validationMessage));
            }
            reqParam.categoryId = reqParam.categoryId.split(",");
            let deleteCategory =  await Category.updateMany({_id:{$in:reqParam.categoryId}},{$set:{status:3}});
        }
        return helper.success(res,res.__("categoryDeletedSuccessFully"), META_STATUS_1,SUCCESSFUL)
    }catch (e) {
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}