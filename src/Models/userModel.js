// models/userModel.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const UserModel = {
    createUser: async (data) => {
        return await prisma.user.create({ data });
    },

    findUserByEmail: async (email) => {
        return await prisma.user.findUnique({ where: { email } });
    },

    getSchedulingByUserId: async (userId) => {
        return await prisma.agendamento.findMany({ where: { userId } });
    },

    getAllUsers: async () => {
        return await prisma.user.findMany();
    },

    getUserById: async (id) => {
        return await prisma.user.findUnique({ where: { id } });
    },

    updateUser: async (id, data) => {
        return await prisma.user.update({ where: { id }, data });
    },

    deleteUser: async (id) => {
        return await prisma.user.delete({ where: { id } });
    },
};

module.exports = UserModel;
