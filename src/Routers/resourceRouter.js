const express = require('express');
const router = express.Router();
const resourceController = require('../Controllers/resourceController');
const authAdminMiddleware = require('../Middlewares/authAdminMiddleware');

router.post('/api/recurso', authAdminMiddleware, resourceController.createResource);
router.get('/api/recursos', resourceController.getAllResources);
router.get('/api/recurso/:id', resourceController.getResourceById);
router.put('/api/recurso/:id', resourceController.updateResource);
router.get('/api/recurso/:id/agendamentos', resourceController.getResourceSchedulings);
router.delete('/api/recurso/:id', resourceController.deleteResource);

module.exports = router;