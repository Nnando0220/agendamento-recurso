require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Criação de usuários
    const user1 = await prisma.user.create({
      data: {
        email: 'johndoe@example.com',
        name: 'John Doe',
        funcao: 'admin',
        password: 'password123',
      },
    });
  
    const user2 = await prisma.user.create({
      data: {
        email: 'janedoe@example.com',
        name: 'Jane Doe',
        funcao: 'funcionario',
        password: 'password456',
      },
    });
  
    console.log('Usuários criados:', user1, user2);
  
    // Criação de recursos
    const recurso1 = await prisma.recurso.create({
      data: {
        status: 'disponível',
        tipo: 'sala',
        local: 'Bloco A',
      },
    });
  
    const recurso2 = await prisma.recurso.create({
      data: {
        status: 'ocupado',
        tipo: 'equipamento',
        local: 'Bloco B',
      },
    });
  
    console.log('Recursos criados:', recurso1, recurso2);
  
    // Criação de agendamentos
    const agendamento1 = await prisma.agendamento.create({
      data: {
        userId: user1.id,
        recursoId: recurso1.id,
        data: new Date(),
      },
    });
  
    const agendamento2 = await prisma.agendamento.create({
      data: {
        userId: user2.id,
        recursoId: recurso2.id,
        data: new Date(),
      },
    });
  
    console.log('Agendamentos criados:', agendamento1, agendamento2);
}
  
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });