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
	score : {
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
	},
	daily : {
		numberActions : {
			type : Number,
			default : 0,
		},
		numberTryDemasked : {
			type : Number,
			default : 0,
		},
	},
	isActive : {
		type : Boolean,
		default : false,
	},
	tig : {
		active : {
			type : Boolean,
			default : false,
		},
		time : {
			type : Date,
			default : null,
		},
	},
	admin : {
		type : Boolean,
		default : false,
	},
}, { timestamps : true });

const UserModel =
	mongoose.models.User ||
	mongoose.model<IUser>('User', UserSchema);

export default UserModel;