const Joi = require('joi');
const helper = require("../../helper/helper");


//JOI validation
module.exports ={
    async offerValidation(req)
    {
        const offerSchema = Joi.object({
            title: Joi.string().required(),
            description: Joi.string().required(),
            offerType:Joi.string().required(),
        }).unknown(true);
        const { error } = offerSchema.validate(req);
        if (error) {
            return helper.validationMessageKey("Validation", error);
        }
        return null;
    },
    async editOfferValidation(req)
    {
    const offerSchema = Joi.object({
        offerId: Joi.string().required(),
    }).unknown(true);
    const { error } = offerSchema.validate(req);
    if (error) {
        return helper.validationMessageKey("Validation", error);
    }
    return null;
    },
}