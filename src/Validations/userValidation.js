const joi = require('joi');

const userRegisterSchema = joi.object({
    email: joi.string().email().required(),
    name: joi.string().min(3).max(255).required(),
    funcao: joi.string().valid('admin', 'funcionario').required(),
    password: joi.string().min(6).required(),
});

const userLoginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
});

module.exports = {
    userRegisterSchema,
    userLoginSchema,
};