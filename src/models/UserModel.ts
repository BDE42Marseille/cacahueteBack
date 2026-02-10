import mongoose, { Schema } from 'mongoose';
import type { IUser } from '../types/models/IUser.js';

const UserSchema = new Schema<IUser>({
	login : {
		type : String,
		required : true,
	},
	password : {
		type : String,
		required : true,
	},
	goodPoint : {
		type : Number,
		default : 0,
	},
	revealPoint : {
		type : Number,
		default : 0,
	},
	revealedPoint : {
		type : Number,
		default : 0,
	},
	totalScore : {
		type : Number,
		default : 0,
	},
	numberActions : {
		type : Number,
		default : 0,
	},
	isActive : {
		type : Boolean,
		default : false,
	},
	lastTimeActions : Date,
	lastUnmaskingAttempt : Date,
	numberTryDemasked : {
		type : Number,
		default : 0,
	},
	tig: {
		type : Boolean,
		default : false,
	},
	tigTime : Date,
	admin : {
		type : Boolean,
		default : false,
	},
}, { timestamps : true });

const UserModel =
	mongoose.models.User ||
	mongoose.model<IUser>('User', UserSchema);

export default UserModel;