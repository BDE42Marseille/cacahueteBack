import mongoose, { Schema } from 'mongoose';
import type { IAction } from '../types/models/IAction.js';

const ActionSchema = new Schema<IAction>({
	type : {
		type : Number,
		required : true,
	},
	name : {
		type : String,
		required : true,
	},
	description : {
		type : String,
		required : true,
	},
}, { timestamps : true });

const ActionModel =
	mongoose.models.Action ||
	mongoose.model<IAction>('Action', ActionSchema);
	
export default ActionModel;