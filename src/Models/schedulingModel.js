const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const SchedulingModel = {
    createScheduling: async (data) => {
        return await prisma.agendamento.create({data});
    },

    existScheduling: async (recursoId, data) => {
        return await prisma.agendamento.findFirst({
            where: {
                recursoId,
                data: new Date(data)
            }
        });
    },

    getAllSchedulings: async () => {
        return await prisma.agendamento.findMany();
    },

    getSchedulingById: async (id) => {
        return await prisma.agendamento.findUnique({where: {id}});
    },

    updateScheduling: async (id, data) => {
        return await prisma.agendamento.update({where: {id}, data});
    },

    deleteScheduling: async (id) => {
        return await prisma.agendamento.delete({where: {id}});
    },
};

module.exports = SchedulingModel;