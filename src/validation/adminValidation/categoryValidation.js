const Joi = require('joi');
const { joiPassword } = require('joi-password');
const helper = require("../../helper/helper");


//JOI validation
module.exports ={
    async categoryValidation(req)
    {
        const categorySchema = Joi.object({
            categoryName: Joi.string().pattern(/^[a-zA-Z]+$/).required(),
            categoryDescription: Joi.string().required()
        }).unknown(true);
        const { error } = categorySchema.validate(req);
        if (error) {
            return helper.validationMessageKey("Validation", error);
        }
        return null;
    },
}