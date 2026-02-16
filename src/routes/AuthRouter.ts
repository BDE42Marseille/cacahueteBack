import express from 'express';
import { AuthController } from '../controllers/index.js';
import { bearerTokenHandler } from '../services/middleware/UserMiddleware.js';

const AuthRouter = express.Router();

AuthRouter.post('/login', AuthController.login);
AuthRouter.post('/register', AuthController.register);
AuthRouter.get('/me', bearerTokenHandler, AuthController.me);

export default AuthRouter;