import express from 'express';
import { adminHandler, bearerTokenHandler } from '../services/middleware/UserMiddleware.js';
import { ActionController } from '../controllers/index.js';

const ActionRouter = express.Router();

ActionRouter.post('/', bearerTokenHandler, adminHandler, ActionController.create);
ActionRouter.get('/', bearerTokenHandler, ActionController.getAll);
ActionRouter.delete('/:id', bearerTokenHandler, adminHandler, ActionController.delete);
ActionRouter.put('/:id', bearerTokenHandler, adminHandler, ActionController.update);

export default ActionRouter;