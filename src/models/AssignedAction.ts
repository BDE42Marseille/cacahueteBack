import mongoose, { Schema } from 'mongoose';
import type { IAssignedAction } from '../types/models/IAssignedAction.js';

const AssignedActionSchema = new Schema<IAssignedAction>({
	action : {
		type : Schema.Types.ObjectId,
		ref : 'Action',
		required : true,
	},
	angel : {
		type : Schema.Types.ObjectId,
		ref : 'User',
		required : true,
	},
	target : {
		type : Schema.Types.ObjectId,
		ref : 'User',
		required : true,
	},
	status : {
		type : Number,
		default : 0,
	},
	isUnmasked : {
		type : Boolean,
		default : false,
	},
}, { timestamps : true });

const AssignedActionModel =
	mongoose.models.AssignedAction ||
	mongoose.model<IAssignedAction>('AssignedAction', AssignedActionSchema);
	
export default AssignedActionModel;