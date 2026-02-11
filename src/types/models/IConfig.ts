import { Types, Document } from 'mongoose';
import type { stateEvent } from '../enum/enumStateEvent.js';

export interface IConfig extends Document {
	stateEvent : stateEvent;
	maxActionPerDay : number;
	maxActionPerHours : number;
	maxTryDemaskPerDay : number;
	easyActionPoint : number;
	hardActionPoint : number;
	tigTime : number;
};