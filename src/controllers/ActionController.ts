import type { Request, Response } from "express";
import { ActionModel } from "../models/index.js";

export default {
	async getAll(req: Request, res: Response) {
		try {
			const actions = await ActionModel.find().lean();
			return res.status(200).json({
				succes: true,
				data: actions,
			});
		} catch (err) {
			console.error(`getAll Action : \n${err}\n`);
			return res.status(500).json({
				succes: false,
				error: "Internal server error",
			});
		}
	},
	async create(req: Request, res: Response) {
		try {
			const { type, name, description } = req.body;
			if (!type || !name || !description) {
				return res.status(400).json({
					succes: false,
					error: "Missing type, name or description",
				});
			}
			await ActionModel.create({ type, name, description });
			const actions = await ActionModel.find().lean();
			return res.status(201).json({
				succes: true,
				data: actions,
			});
		} catch (err) {
			console.error(`create Action : \n${err}\n`);
			return res.status(500).json({
				succes: false,
				error: "Internal server error",
			});
		}
	},
	async delete(req: Request, res: Response) {
		try {
			const { id } = req.params;
			if (!id) {
				return res.status(400).json({
					succes: false,
					error: "Missing id",
				});
			}
			await ActionModel.findByIdAndDelete(id);
			const actions = await ActionModel.find().lean();
			return res.status(200).json({
				succes: true,
				data: actions,
			});
		} catch (err) {
			console.error(`delete Action : \n${err}\n`);
			return res.status(500).json({
				succes: false,
				error: "Internal server error",
			});
		}
	},
	async update(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { type, name, description } = req.body;
			if (!id || !type || !name || !description) {
				return res.status(400).json({
					succes: false,
					error: "Missing id, type, name or description",
				});
			}
			await ActionModel.findByIdAndUpdate(id, { type, name, description });
			const actions = await ActionModel.find().lean();
			return res.status(200).json({
				succes: true,
				data: actions,
			});
		} catch (err) {
			console.error(`update Action : \n${err}\n`);
			return res.status(500).json({
				succes: false,
				error: "Internal server error",
			});
		}
	},
}
