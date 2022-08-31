const Joi = require('joi');
const { joiPassword } = require('joi-password');
const helper = require("../../helper/helper");


//JOI validation
module.exports ={
    async editProductValidation(req)
    {
        const editProductSchema = Joi.object({
            categoryId:Joi.string(),
            subCategoryId:Joi.string(),
            productId:Joi.string().required(),
            productName: Joi.string(),
            productNameGuj:Joi.string(),
            productDescription: Joi.string(),
            productDescriptionGuj: Joi.string(),
            productPrice:Joi.string().pattern(/^[0-9]+$/),
            productDiscount:Joi.number().min(0).max(100),
            productImage:Joi.string(),
            status: Joi.number().greater(0).less(3)
        }).unknown(true);
        const { error } = editProductSchema.validate(req);
        if (error) {
            return helper.validationMessageKey("Validation", error);
        }
        return null;
    },

    async productValidation(req)
    {
        const productSchema = Joi.object({
            categoryId:Joi.string(),
            subCategoryId:Joi.string(),
            productName: Joi.string(),
            productPrice:Joi.string().pattern(/^[0-9]+$/),
            productDiscount:Joi.number().min(0).max(100),
            productDescription: Joi.string(),
            productImage: Joi.string()
        }).unknown(true);
        const { error } = productSchema.validate(req);
        if (error) {
            return helper.validationMessageKey("Validation", error);
        }
        return null;
    },
}