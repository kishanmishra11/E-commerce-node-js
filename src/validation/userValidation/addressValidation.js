const Joi = require('joi');
const { joiPassword } = require('joi-password');
const helper = require("../../helper/helper");

//JOI validation
module.exports ={
    async addressValidation(req)
    {
        const addressSchema = Joi.object({
            userName: Joi.string().min(3).max(25).trim(true).required(),
            phone: Joi.string().pattern(/^[0-9]+$/).length(10).required(),
            email: Joi.string().email().required({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
            cityId:Joi.string().required(),
            houseNo:Joi.string().required(),
        }).unknown(true);
        const { error } = addressSchema.validate(req);
        if (error) {
            return helper.validationMessageKey("Validation", error);
        }
        return null;
    },
    async editAddressValidation(req)
    {
        const editAddressSchema = Joi.object({
            addressId:Joi.string().required(),
            userName: Joi.string(),
            phone: Joi.string(),
            email:Joi.string(),
            houseNo:Joi.string(),
            status: Joi.number().greater(0).less(3),
        }).unknown(true);
        const { error } = editAddressSchema.validate(req);
        if (error) {
            console.log("err",error);
            return helper.validationMessageKey("Validation", error);
        }
        return null;
    }
}