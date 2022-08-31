const Joi = require('joi');
const { joiPassword } = require('joi-password');
const helper = require("../../helper/helper");


//JOI validation
module.exports ={
    async productValidation(req)
    {
    const productSchema = Joi.object({
    categoryId:Joi.string().required(),
    subCategoryId:Joi.string().required(),
    productName: Joi.string().required(),
    productPrice:Joi.string().pattern(/^[0-9]+$/).required(),
    productDiscount:Joi.number().min(0).max(100),
    productDescription: Joi.string().required()
    }).unknown(true);
        const { error } = productSchema.validate(req);
        if (error) {
            return helper.validationMessageKey("Validation", error);
        }
        return null;
    },
}