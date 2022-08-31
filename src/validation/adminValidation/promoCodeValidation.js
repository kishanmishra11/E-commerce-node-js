const Joi = require('joi');
const { joiPassword } = require('joi-password');
const helper = require("../../helper/helper");


//JOI validation
module.exports ={
    async promoCodeValidation(req)
    {
        const promoCodeSchema = Joi.object({
            promoCodeName:Joi.string().required(),
            promoDiscount:Joi.number().min(0).max(100),
            startDate: Joi.date().required(),
            endDate: Joi.date().required()
        }).unknown(true);
        const { error } = promoCodeSchema.validate(req);
        if (error) {
            return helper.validationMessageKey("Validation", error);
        }
        return null;
    },
    async editPromoValidation(req)
    {
        const editPromoSchema = Joi.object({
            promoCodeId:Joi.string().required(),
            promoCodeName:Joi.string(),
            promoDiscount:Joi.number().min(0).max(100),
            startDate: Joi.date(),
            endDate: Joi.date(),
            status: Joi.number().greater(0).less(3)
        }).unknown(true);
        const { error } = editPromoSchema.validate(req);
        if (error) {
            return helper.validationMessageKey("Validation", error);
        }
        return null;
    },
}