# Projeto de Agendamento de Recursos

Este projeto é uma API RESTful para o agendamento de recursos, permitindo que os usuários reservem recursos específicos para datas e durações determinadas. Foi desenvolvido com Node.js, Express.js e Prisma ORM integrado ao MongoDB.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução para JavaScript.
- **Express.js**: Framework para criação de APIs RESTful.
- **Prisma ORM**: Ferramenta para manipulação de banco de dados.
- **MongoDB**: Banco de dados utilizado.
- **Joi**: Biblioteca para validação de dados.

## Utilização

A API oferece rotas para a criação, leitura, atualização e exclusão de agendamentos e recursos, além de funcionalidades de autenticação para gerenciar o acesso de diferentes tipos de usuários (administradores e usuários comuns). Abaixo estão alguns exemplos de utilização:

- **Agendar um recurso**: Usuários autenticados podem reservar um recurso específico para uma data e duração desejada.
- **Consultar agendamentos**: Todos os usuários podem verificar a lista de agendamentos, enquanto administradores podem consultar e gerenciar todos os recursos disponíveis.
- **Gerenciamento de recursos**: Administradores têm controle completo para adicionar novos recursos, atualizar suas informações e removê-los, conforme necessário.
