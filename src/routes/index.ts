import express from 'express';
import AuthRouter from './AuthRouter.js';
import ActionRouter from './ActionRouter.js';
import AssignationActionRouter from './AssignationActionRouter.js';

const router = express.Router();
router.use('/auth', AuthRouter);
router.use('/actions', ActionRouter);
router.use('/assignation', AssignationActionRouter);

export default router;