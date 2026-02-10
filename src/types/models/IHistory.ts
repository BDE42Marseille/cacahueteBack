import { Types, Document } from 'mongoose';

export interface IHistory extends Document {
	user : string;
	action : string;
}