const Joi = require('joi');
const { joiPassword } = require('joi-password');
const helper = require("../../helper/helper");

//JOI validation
module.exports ={
    async adminValidation(req)
    {
        const adminSchema = Joi.object({
            email: Joi.string().email().required({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
            password: joiPassword.string().min(8).max(12).minOfSpecialCharacters(1).minOfLowercase(1).minOfUppercase(1).minOfNumeric(1).noWhiteSpaces().required()
        }).unknown(true);
        const { error } = adminSchema.validate(req);
        if (error) {
            return helper.validationMessageKey("Validation", error);
        }
        return null;
    },
}