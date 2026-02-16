import express from 'express';
import { adminHandler, bearerTokenHandler } from '../services/middleware/UserMiddleware.js';
import { AssignationActionController } from '../controllers/index.js';

const AssignationActionRouter = express.Router();

AssignationActionRouter.post('/request', bearerTokenHandler, AssignationActionController.requestAssignation);
AssignationActionRouter.get('/', bearerTokenHandler, AssignationActionController.getAction);
AssignationActionRouter.get('/to-check', bearerTokenHandler, AssignationActionController.getAllActiontoCheck);
AssignationActionRouter.get('/validate', bearerTokenHandler, AssignationActionController.getAllActionValidate);
AssignationActionRouter.get('/actually', bearerTokenHandler, AssignationActionController.getCurrentAction);
AssignationActionRouter.post('/validate-angel/:id', bearerTokenHandler, AssignationActionController.validateActionAngel);
AssignationActionRouter.post('/validate-target/:id', bearerTokenHandler, AssignationActionController.validateActionTarget);
AssignationActionRouter.post('/abandon/:id', bearerTokenHandler, AssignationActionController.abandonAction);
AssignationActionRouter.post('/demask/:id', bearerTokenHandler, AssignationActionController.tryDemask);
AssignationActionRouter.get('/admin', bearerTokenHandler, adminHandler, AssignationActionController.getAdminAssignedActions);

export default AssignationActionRouter;
