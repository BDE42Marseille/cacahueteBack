import { Types, Document } from 'mongoose';

export interface IUser extends Document {
	login : string;
	password : string;
	goodPoint : number;
	revealPoint : number;
	revealedPoint : number;
	totalScore : number;
	numberActions : number;
	isActive : boolean;
	lastTimeActions : Date;
	lastUnmaskingAttempt : Date;
	numberTryDemasked : number;
	tig: boolean;
	tigTime : Date;
};