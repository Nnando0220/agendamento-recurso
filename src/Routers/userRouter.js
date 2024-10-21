const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const validateToken = require('../Middlewares/authUserSchedulig');
const authAdminMiddleware = require('../Middlewares/authAdminMiddleware'); 

router.post('/api/login', userController.loginUser);
router.post('/api/cadastro', userController.registerUser);
router.get('/api/usuario/agendamentos', validateToken, userController.userResourceSchedulings);

// Rotas de admin
router.get('/api/usuarios', authAdminMiddleware, userController.getAllUsers);
router.get('/api/usuario/:id', authAdminMiddleware, userController.getUserById);
router.put('/api/usuario/:id', authAdminMiddleware, userController.updateUser);
router.delete('/api/usuario/:id', authAdminMiddleware, userController.deleteUser);   

module.exports = router;