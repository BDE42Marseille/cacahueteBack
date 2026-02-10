import { Types, Document } from 'mongoose';

export enum stateEvent {
	register,
	start,
	freeze,
	result
}

export interface IConfig extends Document {
	stateEvent : stateEvent;
	maxActionPerDay : number;
	maxActionPerHours : number;
	maxTryDemaskPerDay : number;
	tigTime : number;
};