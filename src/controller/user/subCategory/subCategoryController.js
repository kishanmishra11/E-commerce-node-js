const SubCategoryController = require('../../../model/subcategory');
const subCategoryTransformerUser = require('../../../transformer/userTransformer/subcategoryTransformer');
const subCategoryService = require('../../../service/adminService/subcatservice');
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
        const response = subCategoryTransformerUser.subCategoryListTransformDetailsUser(responseData, lang)
        return helper.success(res,res.__("subCategoryListedSuccessfully"),META_STATUS_1,SUCCESSFUL,response,{"totalCount":totalCount})
    }catch(e){
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}



//view subCategory
exports.viewSubCategory = async (req,res) => {
    try{
        let reqParam = req.body;
        let existingSubCategory = await SubCategoryController.findOne({_id: reqParam.subCategoryId, status: {$ne: 3}});
        if(!existingSubCategory) return helper.success(res, res.__("subCategoryNotFound"), META_STATUS_0, SUCCESSFUL);
        const response = subCategoryTransformerUser.subCategoryTransformDetailsUser(existingSubCategory);
        return helper.success(res,res.__("subCategoryFoundSuccessfully"),META_STATUS_1,SUCCESSFUL,response)
    } catch(e){
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}