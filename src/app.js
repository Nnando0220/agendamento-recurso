const express = require('express');
require('dotenv').config();
const routerUser  = require('./Routers/userRouter.js');
const routerResource = require('./Routers/resourceRouter.js');
const routerScheduling = require('./Routers/schedulingRouter.js');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger/swagger.json'); 

const app = express();
app.use(express.json());
app.use(routerUser, routerResource, routerScheduling);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


module.exports = app;