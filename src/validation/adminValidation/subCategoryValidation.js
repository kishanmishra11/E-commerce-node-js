const Joi = require('joi');
const { joiPassword } = require('joi-password');
const helper = require("../../helper/helper");

//JOI validation
module.exports ={
    async subCategoryValidation(req)
    {
    const subCategorySchema = Joi.object({
    categoryId:Joi.string().required(),
    subCategoryName: Joi.string().pattern(/^[a-zA-Z]+$/).required(),
    subCategoryDescription: Joi.string().required()
    }).unknown(true);
        const { error } = subCategorySchema.validate(req);
        if (error) {
            return helper.validationMessageKey("Validation", error);
        }
        return null;
    },
}