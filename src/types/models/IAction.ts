import { Types, Document } from 'mongoose';

export enum difficulty {
	easy,
	hard
}

export interface IAction extends Document {
	type: difficulty;
	name : string;
	description: string;
}