const Joi = require('joi');
const { joiPassword } = require('joi-password');
const helper = require("../../helper/helper");


//JOI validation
module.exports ={
    async deleteValidation(req)
    {
        const deleteSchema = Joi.object({
            all: Joi.boolean().required(),
        }).unknown(true);
        const { error } = deleteSchema.validate(req);
        if (error) {
            return helper.validationMessageKey("Validation", error);
        }
        return null;
    },

    async deleteSubCategoryValidation(req)
    {
        const deleteSubCategorySchema = Joi.object({
            subCategoryId: Joi.string().required(),
        }).unknown(true);
        const { error } = deleteSubCategorySchema.validate(req);
        if (error) {
            return helper.validationMessageKey("Validation", error);
        }
        return null;
    },
}