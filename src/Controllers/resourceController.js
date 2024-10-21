const resourceModel = require('../Models/resourceModel');
const { resourceSchema } = require('../Validations/resourceValidation');
const joi = require('joi');

const resourceController = {
    createResource: async (req, res) => {
        const { error } = resourceSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        try {
            const { status, tipo, local } = req.body;
            const resource = await resourceModel.createResource({ status, tipo, local });
            return res.status(202).json(resource); 

        } catch (error) {
            return res.status(500).json({ error: 'Erro ao criar recurso.' });
        }
    },

    getAllResources: async (req, res) => {
        try {
            const resources = await resourceModel.getAllResources();
            return res.status(200).json(resources);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao listar recurso.' });
        }
    },

    getResourceById: async (req, res) => {
        try {
            const { id } = req.params;
            const resource = await resourceModel.getResourceById(id);
            if (!resource) {
                return res.status(404).json({ error: 'Recurso não encontrado.' });
            }
            return res.status(200).json(resource);  
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao encontrar recurso.' });
        }
    },

    updateResource: async (req, res) => {
        const updateSchema = joi.object({
            status: joi.string().valid('disponível', 'ocupado').optional(), 
            tipo: joi.string().optional(), 
            local: joi.string().optional(), 
            agendamento: joi.array().items(joi.string()).optional(),      
        });
        const { error } = updateSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        try {
            const { id } = req.params;
            const { status, tipo, local } = req.body;
            const resource = await resourceModel.getResourceById(id);
            if (!resource) {
                return res.status(404).json({ error: 'Recurso não encontrado.' });
            }
            const newResource = await resourceModel.updateResource(id, { status, tipo, local });
            return res.status(200).json(newResource);  
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao atualizar recurso.' });
        }
    },

    deleteResource: async (req, res) => {
        try {
            const { id } = req.params;
            const resource = await resourceModel.getResourceById(id);
            if (!resource) {
                return res.status(404).json({ error: 'Recurso não encontrado.' });
            }
            await resourceModel.deleteResource(id);
            return res.status(200).json({ message: 'Recurso deletado.' });  
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao deletar recurso.' });
        }
    },

    getResourceSchedulings: async (req, res) => {
        try {
            const { id } = req.params;
            const schedulings = await resourceModel.getSchedulingsByResourceId(id);
            return res.status(200).json(schedulings);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao listar agendamento.' });
        }
    },
};

module.exports = resourceController;
