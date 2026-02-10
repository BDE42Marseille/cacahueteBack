import { Types, Document } from 'mongoose';
import type { IAction } from './IAction.js';
import type { IUser } from './IUser.js';

export enum stateAction {
	pending,
	completed,
	abandoned,
	failed
}

export interface IAssignedAction extends Document {
	action : string | IAction;
	angel : string | IUser;
	target : string | IUser;
	status : stateAction;
	isUnmasked : boolean;
}