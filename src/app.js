const express = require('express');
require('dotenv').config();
const routerUser  = require('./Routers/userRouter.js');
const routerResource = require('./Routers/resourceRouter.js');
const routerScheduling = require('./Routers/schedulingRouter.js'); 

const app = express();
app.use(express.json());
app.use(routerUser, routerResource, routerScheduling);



module.exports = app;