const Joi = require('joi');
const { joiPassword } = require('joi-password');
const helper = require("../../helper/helper");

//JOI validation
module.exports ={
    async editSubCategoryValidation(req)
    {
        const editSubCategorySchema = Joi.object({
            categoryId:Joi.string(),
            subCategoryId:Joi.string().required(),
            subCategoryName: Joi.string(),
            subCategoryNameGuj:Joi.string(),
            subCategoryDescription: Joi.string(),
            subCategoryDescriptionGuj: Joi.string(),
            subCategoryImage:Joi.string(),
            status: Joi.number().greater(0).less(3)
        }).unknown(true);
        const { error } = editSubCategorySchema.validate(req);
        if (error) {
            return helper.validationMessageKey("Validation", error);
        }
        return null;
    },
    async subCategoryValidation(req)
    {
        const subCategorySchema = Joi.object({
            categoryId:Joi.string().required(),
            subCategoryName: Joi.string().required(),
            subCategoryDescription: Joi.string()
        }).unknown(true);
        const { error } = subCategorySchema.validate(req);
        if (error) {
            return helper.validationMessageKey("Validation", error);
        }
        return null;
    },
}