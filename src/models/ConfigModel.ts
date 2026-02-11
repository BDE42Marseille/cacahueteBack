import mongoose, { Schema } from 'mongoose';
import type { IConfig } from '../types/models/IConfig.js';

const ConfigSchema = new Schema<IConfig>({
	stateEvent : {
		type : Number,
		default : 0,
	},
	maxActionPerDay : {
		type : Number,
		default : 5,
	},
	maxActionPerHours : {
		type : Number,
		default : 2,
	},
	maxTryDemaskPerDay : {
		type : Number,
		default : 3,
	},
	easyActionPoint : {
		type : Number,
		default : 1,
	},
	hardActionPoint : {
		type : Number,
		default : 2,
	},
	tigTime : {
		type : Number,
		default : 1,
	},
}, { timestamps : true });

const ConfigModel =
	mongoose.models.Config ||
	mongoose.model<IConfig>('Config', ConfigSchema);
	
export default ConfigModel;