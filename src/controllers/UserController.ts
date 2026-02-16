import type { Request, Response } from "express";
import { UserModel } from "../models/index.js";
import type { IUser } from "../types/models/IUser.js";

export default {
	getAllUsersNames: async (req: Request, res: Response) => {
		try {
			const users = await UserModel.find({ _id: { $ne: res.locals.decoded._id } }).select({ login: 1, _id: 0 }).lean();
			return res.status(200).json({
				succes: true,
				users: users.map((user: IUser) => user.login),
			});
		} catch (error) {
			console.error(`Get all users names : \n${error}\n`);
			return res.status(500).json({
				succes: false,
				error: "Internal server error",
			});
		}
	},
	topUsers: async (req: Request, res: Response) => {
		try {
			const users = await UserModel.find().select({ login: 1, "score.totalScore": 1}).sort({ "score.totalScore": -1 }).limit(10).lean();
			return res.status(200).json({
				succes: true,
				users,
			});
		} catch (error) {
			console.error(`Get top users : \n${error}\n`);
			return res.status(500).json({
				succes: false,
				error: "Internal server error",
			});
		}
	},
}