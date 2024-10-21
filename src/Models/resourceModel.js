const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ResourceModel = {
    createResource: async (data) => {
        return await prisma.recurso.create({ data });
    },

    updateResourceAvibiliaty: async (id, status) => {
        return await prisma.recurso.update({ where: { id }, data: { status: status } });        
    },

    getAllResources: async () => {
        return await prisma.recurso.findMany();
    },

    getResourceById: async (id) => {
        return await prisma.recurso.findUnique({ where: { id } });
    },

    getSchedulingsByResourceId: async (id) => {
        return await prisma.agendamento.findMany({ where: { recursoId: id } });
    },

    updateResource: async (id, data) => {
        return await prisma.recurso.update({ where: { id }, data });
    },

    deleteResource: async (id) => {
        return await prisma.recurso.delete({ where: { id } });
    },
};

module.exports = ResourceModel;