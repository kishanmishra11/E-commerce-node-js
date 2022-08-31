const Joi = require('joi');
const { joiPassword } = require('joi-password');
const helper = require("../../helper/helper");

//JOI validation
module.exports ={
    async cartValidation(req)
    {
        const cartSchema = Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().min(1).required()
    }).unknown(true);
        const { error } = cartSchema.validate(req);
        if (error) {
        return helper.validationMessageKey("Validation", error);
        }
    return null;
    },
}