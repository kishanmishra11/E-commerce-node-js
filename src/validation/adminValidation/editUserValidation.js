const Joi = require('joi');
const { joiPassword } = require('joi-password');
const helper = require("../../helper/helper");

//JOI validation
module.exports ={
    async editUserValidation(req)
    {
        const editUserSchema = Joi.object({
            userId:Joi.string().required(),
            status: Joi.number().greater(0).less(3),
            profilePicture: Joi.string()
        }).unknown(true);
        const { error } = editUserSchema.validate(req);
        if (error) {
            return helper.validationMessageKey("Validation", error);
        }
        return null;
    },
    async userValidation(req)
    {
        const SignupSchema = Joi.object({
            userName: Joi.string().pattern(/^[A-Za-z]+$/).min(3).max(25).trim(true),
            phone: Joi.string().pattern(/^[0-9]+$/).length(10),
            email: Joi.string().email().required({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
            password: joiPassword.string().min(8).max(12).minOfSpecialCharacters(1).minOfLowercase(1).minOfUppercase(1).minOfNumeric(1).noWhiteSpaces(),
            profilePicture: Joi.string()
        }).unknown(true);
        const { error } = SignupSchema.validate(req);
        if (error) {
            return helper.validationMessageKey("Validation", error);
        }
        return null;
    },
}