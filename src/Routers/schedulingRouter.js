const express = require('express');
const router = express.Router();
const schedulingController = require('../Controllers/schedulingController');
const validateToken = require('../Middlewares/authUserSchedulig');
const authAdminMiddleware = require('../Middlewares/authAdminMiddleware');

router.post('/api/agendamento', validateToken, schedulingController.createScheduling);
router.get('/api/agendamentos', schedulingController.getAllSchedulings);
router.get('/api/agendamento/:id', schedulingController.getSchedulingById);
router.put('/api/agendamento/:id', validateToken, schedulingController.updateScheduling);
router.delete('/api/agendamento/:id', validateToken, schedulingController.deleteScheduling);

module.exports = router;