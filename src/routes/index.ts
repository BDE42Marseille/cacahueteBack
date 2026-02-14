import express from 'express';
import AuthRouter from './AuthRouter.js';
import ActionRouter from './ActionRouter.js';
import AssignationActionRouter from './AssignationActionRouter.js';
import ConfigRouter from './ConfigRouter.js';
import UserRouter from './UserRouter.js';

const router = express.Router();
router.use('/auth', AuthRouter);
router.use('/actions', ActionRouter);
router.use('/assignation', AssignationActionRouter);
router.use('/config', ConfigRouter);
router.use('/users', UserRouter);

export default router;