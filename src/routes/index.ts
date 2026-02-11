import express from 'express';
import AuthRouter from './AuthRouter.js';
import ActionRouter from './ActionRouter.js';

const router = express.Router();
router.use('/auth', AuthRouter);
router.use('/actions', ActionRouter);


export default router;