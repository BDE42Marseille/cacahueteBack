import express from 'express';
import VoteRouter from './VoteRouter.js';

const router = express.Router();

router.use('/vote', VoteRouter);

export default router;