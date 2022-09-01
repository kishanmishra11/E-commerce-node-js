const CategoryController = require('../../../model/category');
const categoryService = require('../../../service/adminService/categoryservice');
const categoryTransformerUser = require('../../../transformer/userTransformer/categoryTransformer');
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




//List CategoryController
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
        const response = categoryTransformerUser.listTransformCategoryDetailsUser(responseData, lang)
        return helper.success(res,res.__("categoryListedSuccessfully"),META_STATUS_1,SUCCESSFUL,response,{"totalCount":totalCount});
    }catch(e){
        console.log(e)
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}


//view CategoryController
exports.viewCategory = async (req,res) => {
    try{
        let reqParam = req.body;
        let existingCategory = await CategoryController.findOne({_id: reqParam.categoryId, status: {$ne: 3}});
        if(!existingCategory) return helper.success(res, res.__("categoryNotFound"), META_STATUS_0, SUCCESSFUL);
        const response = categoryTransformerUser.transformCategoryDetailsUser(existingCategory);
        return helper.success(res,res.__("categoryFoundSuccessfully"),META_STATUS_1,SUCCESSFUL,response)
    } catch(e){
        return helper.error(res,INTERNAL_SERVER_ERROR,res.__("somethingWentWrong"));
    }
}