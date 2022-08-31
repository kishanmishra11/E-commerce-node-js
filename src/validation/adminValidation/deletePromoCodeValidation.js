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

    async deletePromoCodeValidation(req)
    {
        const deletePromoSchema = Joi.object({
            promoCodeId: Joi.string().required(),
        }).unknown(true);
        const { error } = deletePromoSchema.validate(req);
        if (error) {
            return helper.validationMessageKey("Validation", error);
        }
        return null;
    },
}