import Joi from 'joi';

export const registerUserSchema = Joi.object({
    UserName: Joi.string().required(),
    Email: Joi.string()
        .required()
        .email()
        .messages({
            messages: { 'string.email': '{{#Emalil}} must be a valid email' },
        }),
    Password: Joi.string().required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$')),
});