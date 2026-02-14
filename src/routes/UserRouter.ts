import express from 'express';
import { UserController } from '../controllers/index.js';
import { adminHandler, bearerTokenHandler } from '../services/middleware/UserMiddleware.js';

const UserRouter = express.Router();

UserRouter.get('/', bearerTokenHandler, UserController.getAllUsersNames);
UserRouter.get('/top', bearerTokenHandler, UserController.topUsers);

export default UserRouter;