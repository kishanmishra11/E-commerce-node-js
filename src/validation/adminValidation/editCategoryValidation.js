const Joi = require('joi');
const { joiPassword } = require('joi-password');
const helper = require("../../helper/helper");


//JOI validation
module.exports ={
    async editCategoryValidation(req)
    {
        const editCategorySchema = Joi.object({
            categoryId:Joi.string().required(),
            categoryName: Joi.string(),
            categoryNameGuj:Joi.string(),
            categoryDescription: Joi.string(),
            categoryDescriptionGuj: Joi.string(),
            categoryImage:Joi.string(),
            status: Joi.number().greater(0).less(3)
        }).unknown(true);
        const { error } = editCategorySchema.validate(req);
        if (error) {
            return helper.validationMessageKey("Validation", error);
        }
        return null;
    },
    async categoryValidation(req)
    {
        const categorySchema = Joi.object({
            categoryName: Joi.string().required(),
            categoryDescription: Joi.string().required()
        }).unknown(true);
        const { error } = categorySchema.validate(req);
        if (error) {
            return helper.validationMessageKey("Validation", error);
        }
        return null;
    },

}