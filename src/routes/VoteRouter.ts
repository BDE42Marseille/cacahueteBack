import express from 'express';
import { VoteController } from '../controllers/index.js';

const VoteRouter = express.Router();

VoteRouter.post('/', VoteController.createVote);
VoteRouter.get('/in-progress', VoteController.checkVoteInProgress);
VoteRouter.post('/vote', VoteController.voting);
VoteRouter.post('/end', VoteController.endVote);
VoteRouter.get('/results', VoteController.voteResults);
VoteRouter.get('/', VoteController.getAllVotes);

export default VoteRouter;