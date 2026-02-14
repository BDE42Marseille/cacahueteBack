import express from 'express';
import { ConfigController } from '../controllers/index.js';
import { adminHandler, bearerTokenHandler } from '../services/middleware/UserMiddleware.js';

const ConfigRouter = express.Router();

ConfigRouter.get('/', bearerTokenHandler, adminHandler, ConfigController.getConfig);
ConfigRouter.put('/', bearerTokenHandler, adminHandler, ConfigController.updateConfig);

export default ConfigRouter;