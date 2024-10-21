const schedulingModel = require('../Models/schedulingModel');
const resourceModel = require('../Models/resourceModel');
const userModel = require('../Models/userModel');
const { schedulingSchema } = require('../Validations/schedulingValidation');
const joi = require('joi');


const schedulingController = {
    createScheduling: async (req, res) => {
        const { error } = schedulingSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        try {
            const userId = req.user.userId;
            const { recursoId, data, duracao } = req.body;

            if (!await userModel.getUserById(userId)) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }

            if (!await resourceModel.getResourceById(recursoId)) {
                return res.status(404).json({ error: 'Recurso não encontrado.' });
            }

            if (await schedulingModel.existScheduling(recursoId, data)) {
                return res.status(400).json({ error: 'Recurso já agendado para esta data.' });
            }

            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            const minSchedulingDate = new Date(currentDate);
            minSchedulingDate.setDate(minSchedulingDate.getDate() + 1);
            const schedulingDate = new Date(data);
            schedulingDate.setHours(0, 0, 0, 0);

            if (schedulingDate < minSchedulingDate) {
                return res.status(400).json({ error: 'Data inválida. A data deve ser futura, com pelo menos um dia de antecedência.' });
            }

            await resourceModel.updateResourceAvibiliaty(recursoId, "ocupado");

            const scheduling = await schedulingModel.createScheduling({ data, userId, recursoId, duracao });

            const timeUntilEnd = duracao * 60 * 1000;
            setTimeout(async () => {
                await resourceModel.updateResourceAvibiliaty(recursoId, "disponível");
                await schedulingModel.deleteScheduling(scheduling.id);
            }, timeUntilEnd);

            return res.status(202).json(scheduling);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao agendar recurso.' });
        }
    },

    getAllSchedulings: async (req, res) => {
        try {
            const schedulings = await schedulingModel.getAllSchedulings();
            return res.status(200).json(schedulings);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao listar agendamento.' });
        }
    },

    getSchedulingById: async (req, res) => {
        try {
            const { id } = req.params;
            const scheduling = await schedulingModel.getSchedulingById(id);
            if (!scheduling) {
                return res.status(404).json({ error: 'Agendamento não encontrado.' });
            }
            return res.status(200).json(scheduling);  
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao encontrar agendamento.' });
        }
    },

    updateScheduling: async (req, res) => {
        const updateSchema = joi.object({
            recursoId: joi.string().optional(),
            data: joi.date().optional(),
            duracao: joi.number().optional()
        });
    
        const { error } = updateSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        try {
            const { id } = req.params;
            const { recursoId, data, duracao } = req.body;
            const scheduling = await schedulingModel.getSchedulingById(id);
            
            if (!scheduling) {
                return res.status(404).json({ error: 'Agendamento não encontrado.' });
            }
    
            if (scheduling.userId !== req.user.userId && req.user.funcao !== 'admin') {
                return res.status(401).json({ error: 'Usuário não autorizado.' });
            }
    
            if (recursoId !== undefined && data !== undefined) {
                if (!await resourceModel.getResourceById(recursoId)) {
                    return res.status(404).json({ error: 'Recurso não encontrado.' });
                }
                if (await schedulingModel.existScheduling(recursoId, data)) {
                    return res.status(400).json({ error: 'Recurso já agendado para esta data.' });
                }
            }
    
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            const minSchedulingDate = new Date(currentDate);
            minSchedulingDate.setDate(minSchedulingDate.getDate() + 1);
            const schedulingDate = new Date(data);
            schedulingDate.setHours(0, 0, 0, 0);
    
            if (schedulingDate < minSchedulingDate) {
                return res.status(400).json({ error: 'Data inválida. A data deve ser futura, com pelo menos um dia de antecedência.' });
            }
    
            if (scheduling.recursoId !== recursoId) {
                await resourceModel.updateResourceAvibiliaty(scheduling.recursoId, "disponível");
            } else{
                await resourceModel.updateResourceAvibiliaty(recursoId, "ocupado");
            }
    
            const updatedScheduling = await schedulingModel.updateScheduling(id, { recursoId, data, duracao });
            
            if (duracao !== undefined) {
                clearTimeout(scheduling.timeout);
                const timeUntilEnd = duracao * 60 * 1000;
                setTimeout(async () => {
                    await resourceModel.updateResourceAvibiliaty(recursoId, "disponível");
                    await schedulingModel.deleteScheduling(updatedScheduling.id);
                }, timeUntilEnd);
            }  
            return res.status(200).json(updatedScheduling);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao atualizar agendamento.' });
        }
        
    },
    
    deleteScheduling: async (req, res) => {
        try {
            const { id } = req.params;
            const scheduling = await schedulingModel.getSchedulingById(id);
            
            if (!scheduling) {
                return res.status(404).json({ error: 'Agendamento não encontrado.' });
            }
    
            if (scheduling.userId !== req.user.userId && req.user.funcao !== 'admin') {
                return res.status(401).json({ error: 'Usuário não autorizado.' });
            }
    
            await resourceModel.updateResourceAvibiliaty(scheduling.recursoId, "disponível");
            await schedulingModel.deleteScheduling(id);
            return res.status(200).json({ message: 'Agendamento deletado com sucesso.' });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao deletar agendamento.' });
        }
    },
};

module.exports = schedulingController;