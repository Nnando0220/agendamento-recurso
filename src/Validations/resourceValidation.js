const joi = require('joi');

const resourceSchema = joi.object({
    status: joi.string().valid('disponível', 'ocupado').required(), 
    tipo: joi.string().required(), 
    local: joi.string().required(), 
    agendamento: joi.array().items(joi.string()).optional(), 
});

module.exports = {
    resourceSchema,
};