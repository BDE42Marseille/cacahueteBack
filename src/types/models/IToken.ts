import { Types, Document } from 'mongoose';
import type { IUser } from './IUser.js';

export interface IToken extends Document {
	user : string | IUser;
	token : string;
}