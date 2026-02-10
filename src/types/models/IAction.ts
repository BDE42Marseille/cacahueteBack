import { Types, Document } from 'mongoose';
import type { difficulty } from '../enum/enumDifficulty.js';

export interface IAction extends Document {
	type: difficulty;
	name : string;
	description: string;
}