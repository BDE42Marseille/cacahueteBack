import type { Request, Response } from "express";
import { ConfigModel } from "../models/index.js";


export default {
	getConfig: async (req: Request, res: Response) => {
		try {
			const config = await ConfigModel.findOne().lean();
			if (!config) {
				return res.status(404).json({
					succes: false,
					error: "Config not found",
				});
			}
			return res.status(200).json({
				succes: true,
				config,
			});
		} catch (error) {
			console.error(`Get config : \n${error}\n`);
			return res.status(500).json({
				succes: false,
				error: "Internal server error",
			});
		}
	},
	updateConfig: async (req: Request, res: Response) => {
		try {
			const { config } = req.body;
			if (!config) {
				return res.status(400).json({
					succes: false,
					error: "Missing config",
				});
			}
			const updatedConfig = await ConfigModel.findOneAndUpdate({}, { $set: config }, { new: true, upsert: true }).lean();
			return res.status(200).json({
				succes: true,
				config: updatedConfig,
			});
		} catch (error) {
			console.error(`Update config : \n${error}\n`);
			return res.status(500).json({
				succes: false,
				error: "Internal server error",
			});
		}
	},
}