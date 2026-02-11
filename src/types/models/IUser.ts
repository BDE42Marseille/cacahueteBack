import { Types, Document } from 'mongoose';

export interface IUser extends Document {
	login : string;
	password : string;
	score : {
		goodPoint : number;
		revealPoint : number;
		revealedPoint : number;
		totalScore : number;
	}
	daily : {
		numberActions : number;
		numberTryDemasked : number;
		lastTimeActions : Date;
		lastUnmaskingAttempt : Date;
	}
	isActive : boolean;
	tig : {
		active : boolean;
		time : Date;
	};
	admin : boolean;
};