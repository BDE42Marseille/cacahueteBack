import type { Request, Response } from "express";
import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export default {
	login: async (req: Request, res: Response) => {
		try {
			const { login, password } = req.body;
			if (!login || !password) {
				return res.status(400).json({
					succes: false,
					error: "Missing login or password",
				});
			}
			const user : { password: string, _id: string } | null = await UserModel.findOne({ login }).select({ password: 1, _id: 1 }).lean();
			if (!user) {
				return res.status(401).json({
					succes: false,
					error: "Inknown login",
				});
			}
			const isPasswordValid : boolean = await bcrypt.compare(password, user.password);
			if (!isPasswordValid) {
				return res.status(401).json({
					succes: false,
					error: "Wrong password",
				});
			} else {
				const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
				return res.status(200).json({
					succes: true,
					token
				});
			}
		} catch (error) {
			console.error(`Login : \n${error}\n`);
			return res.status(500).json({
				succes: false,
				error: "Internal server error",
			});
		}
	},
	register: async (req: Request, res: Response) => {
		try {
			const { login, password } = req.body;
			if (!login || !password) {
				return res.status(400).json({
					succes: false,
					error: "Missing login or password",
				});
			}
			const existingUser = await UserModel.findOne({ login : login.trim() }).lean();
			if (existingUser) {
				return res.status(409).json({
					succes: false,
					error: "Login already exists",
				});
			}
			const hashedPassword = await bcrypt.hash(password, 10);
			const newUser = new UserModel({ login: login.trim(), password: hashedPassword });
			await newUser.save();
			return res.status(201).json({
				succes: true,
				message: "User registered successfully",
			});
		} catch (error) {
			console.error(`Register : \n${error}\n`);
			return res.status(500).json({
				succes: false,
				error: "Internal server error",
			});
		}
	},
	me: (req: Request, res: Response) => {
		try {
			return res.status(200).json({
				succes: true,
				user: res.locals.decoded,
			});
		} catch (error) {
			console.error(`CheckAuth : \n${error}\n`);
			return res.status(500).json({
				succes: false,
				error: "Internal server error",
			});
		}
	}
}