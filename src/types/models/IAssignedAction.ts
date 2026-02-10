import { Types, Document } from 'mongoose';
import type { IAction } from './IAction.js';
import type { IUser } from './IUser.js';
import type { stateAction } from '../enum/enumStateAction.js';

export interface IAssignedAction extends Document {
	action : string | IAction;
	angel : string | IUser;
	target : string | IUser;
	status : stateAction;
	isUnmasked : boolean;
}