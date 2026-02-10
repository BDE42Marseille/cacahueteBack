import mongoose, { Schema } from 'mongoose';
import type { IToken } from '../types/models/IToken.js';

const TokenSchema = new Schema<IToken>({
	user : {
		type : Schema.Types.ObjectId,
		ref : 'User',
		required : true,
	},
	token : {
		type : String,
		required : true,
	},
}, { timestamps : true });

const TokenModel =
	mongoose.models.Token ||
	mongoose.model<IToken>('Token', TokenSchema);
	
export default TokenModel;