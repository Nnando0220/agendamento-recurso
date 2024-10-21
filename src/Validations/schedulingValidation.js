const joi = require('joi');

const schedulingSchema = joi.object({ 
    recursoId: joi.string().required(),
    data: joi.date().iso().required(),
    duracao: joi.number().required(),
});

module.exports = { schedulingSchema };