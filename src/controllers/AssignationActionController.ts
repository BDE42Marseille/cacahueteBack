import type { Request, Response } from "express";
import { stateAction } from "../types/enum/enumStateAction.js";
import { difficulty } from "../types/enum/enumDifficulty.js";
import { ActionModel, AssignedActionModel, ConfigModel, UserModel } from "../models/index.js";

export default {
	async requestAssignation(req : Request, res : Response) {
		try {
			const difficulty = req.body.difficulty;
			const config = await ConfigModel.findOne().lean();
			if (res.locals.decoded.isActive) {
				return res.status(200).json({
					succes : false,
					error : "Vous avez déjà une action en cours",
				});
			}
			if (res.locals.decoded.daily.numberActions >= config?.maxActionPerDay) {
				return res.status(200).json({
					succes : false,
					error : "Vous avez atteint votre limite d'actions quotidiennes",
				});
			}
			if (res.locals.decoded.tig.active) {
				if (res.locals.decoded.tig.time && new Date(res.locals.decoded.tig.time).getTime() + config!.tigTime * 60 * 60 * 1000 < Date.now()) {
					await UserModel.findByIdAndUpdate(res.locals.decoded._id, {
						tig : {
							active : false,
							time : null,
						},
					});
				} else {
					return res.status(200).json({
						succes : false,
						error : "Vous êtes actuellement pénalisé car vous avez abandonné votre ancienne action, merci de patienter 1 heure.",
					});
				}
			}
			const allActions = await ActionModel.find({ type: difficulty }).lean();
			const randomAction = allActions[Math.floor(Math.random() * allActions.length)];
			const users = await UserModel.find({ _id : { $ne : res.locals.decoded._id }, admin : false }).lean();
			const randomUser = users[Math.floor(Math.random() * users.length)];
			const assignedAction = await AssignedActionModel.create({
				action : randomAction._id,
				angel : res.locals.decoded._id,
				target : randomUser._id,
			});
			await UserModel.findByIdAndUpdate(res.locals.decoded._id, {
				isActive : true,
				$inc : {
					"daily.numberActions" : 1,
				},
			});
			await assignedAction.save();
			const populatedAssignedAction = await AssignedActionModel.findById(assignedAction._id)
			.populate({
				path: 'action',
			})
			.populate({
				path: 'angel',
				select: 'login',
			})
			.populate({
				path: 'target',
				select: 'login',
			}).lean();
			return res.status(200).json({
				succes : true,
				action : populatedAssignedAction,
			});
		} catch (err) {
			console.error(`Request assignation : \n${err}\n`);
			return res.status(500).json({
				succes : false,
				error : "Internal server error",
			});
		}
	},
	async getAction (req : Request, res : Response) {
		try {
			const assignedActionstoCheck = await AssignedActionModel.find({status : stateAction.tovalidate, target : res.locals.decoded._id}).select({angel : 0}).populate('action').lean();
			const assignedActionValidate = await AssignedActionModel.find({status : stateAction.completed, target : res.locals.decoded._id, isUnmasked : false}).select({angel : 0}).populate('action').lean();
			const assignedAction = await AssignedActionModel.findOne({$and: [{angel : res.locals.decoded._id}, {status : stateAction.pending}]})
			.populate({
				path: 'action',
			})
			.populate({
				path: 'angel',
				select: 'login',
			})
			.populate({
				path: 'target',
				select: 'login',
			}).lean();
			return res.status(200).json({
				succes : true,
				actions : {
					toCheck : assignedActionstoCheck,
					validate : assignedActionValidate,
					current : assignedAction,
				},
			});
		} catch (err) {
			console.error(`Get action : \n${err}\n`);
			return res.status(500).json({
				succes : false,
				error : "Internal server error",
			});
		}
	},
	async getAllActiontoCheck (req : Request, res : Response) {
		try {
			const assignedActionstoCheck = await AssignedActionModel.find({status : stateAction.tovalidate, target : res.locals.decoded._id}).select({angel : 0}).populate('action').lean();
			return res.status(200).json({
				succes : true,
				actions : assignedActionstoCheck,
			});
		} catch (err) {
			console.error(`Get all action to check : \n${err}\n`);
			return res.status(500).json({
				succes : false,
				error : "Internal server error",
			});
		}
	},
	async getAllActionValidate (req : Request, res : Response) {
		try {
			const assignedActionValidate = await AssignedActionModel.find({status : stateAction.completed, target : res.locals.decoded._id, isUnmasked : false}).select({angel : 0}).populate('action').lean();
			return res.status(200).json({
				succes : true,
				actions : assignedActionValidate,
			});
		} catch (err) {
			console.error(`Get all action to check : \n${err}\n`);
			return res.status(500).json({
				succes : false,
				error : "Internal server error",
			});
		}
	},
	async getCurrentAction(req : Request, res : Response) {
		try {
			const assignedAction = await AssignedActionModel.findOne({angel : res.locals.decoded._id, status : stateAction.pending})
			.populate({
				path: 'action',
			})
			.populate({
				path: 'angel',
				select: 'login',
			})
			.populate({
				path: 'target',
				select: 'login',
			}).lean();
			if (!assignedAction) {
				return res.status(404).json({
					succes : false,
					error : "No current action found",
				});
			}
			return res.status(200).json({
				succes : true,
				action : assignedAction,
			});
		} catch (err) {
			console.error(`Get current action : \n${err}\n`);
			return res.status(500).json({
				succes : false,
				error : "Internal server error",
			});
		}
	},
	async validateActionAngel(req : Request, res : Response) {
		try {
			const { id } = req.params;
			const assignedAction = await AssignedActionModel.findById(id).lean();
			if (!assignedAction) {
				return res.status(404).json({
					succes : false,
					error : "Assigned action not found",
				});
			}
			if (assignedAction.angel.toString() !== res.locals.decoded._id.toString()) {
				return res.status(401).json({
					succes : false,
					error : "You are not the angel of this action",
				});
			}
			if (assignedAction.status !== stateAction.pending) {
				return res.status(400).json({
					succes : false,
					error : "This action is not pending",
				});
			}
			await AssignedActionModel.findByIdAndUpdate(id, {status : stateAction.tovalidate});
			await UserModel.findByIdAndUpdate(res.locals.decoded._id, {
				isActive : false,
			});
			return res.status(200).json({
				succes : true,
				message : "Action validée, en attente de validation par la cible !",
			});
		} catch (err) {
			console.error(`Validate action angel : \n${err}\n`);
			return res.status(500).json({
				succes : false,
				error : "Internal server error",
			});
		}
	},
	async validateActionTarget(req : Request, res : Response) {
		try {
			const { id } = req.params;
			const assignedAction = await AssignedActionModel.findById(id).populate('action').lean();
			if (!assignedAction) {
				return res.status(404).json({
					succes : false,
					error : "Assigned action not found",
				});
			}
			if (assignedAction.target.toString() !== res.locals.decoded._id.toString()) {
				return res.status(401).json({
					succes : false,
					error : "You are not the target of this action",
				});
			}
			if (assignedAction.status !== stateAction.tovalidate) {
				return res.status(400).json({
					succes : false,
					error : "This action is not waiting for validation",
				});
			}
			await AssignedActionModel.findByIdAndUpdate(id, {status : stateAction.completed});
			const config = await ConfigModel.findOne().lean();
			const angel = await UserModel.findById(assignedAction.angel);
			angel.score.goodPoint += assignedAction.action.type === difficulty.easy ? config.easyActionPoint : config.hardActionPoint;
			angel.score.totalScore += assignedAction.action.type === difficulty.easy ? config.easyActionPoint : config.hardActionPoint;
			await angel.save();
			return res.status(200).json({
				succes : true,
				message : "Action validated, good job !",
			});
		} catch (err) {
			console.error(`Validate action target : \n${err}\n`);
			return res.status(500).json({
				succes : false,
				error : "Internal server error",
			});
		}
	},
	async abandonAction(req : Request, res : Response) {
		try {
			const { id } = req.params;
			const assignedAction = await AssignedActionModel.findById(id).lean();
			if (!assignedAction) {
				return res.status(404).json({
					succes : false,
					error : "Assigned action not found",
				});
			}
			if (assignedAction.angel.toString() !== res.locals.decoded._id.toString()) {
				return res.status(401).json({
					succes : false,
					error : "You are not the angel of this action",
				});
			}
			if (assignedAction.status !== stateAction.pending) {
				return res.status(400).json({
					succes : false,
					error : "This action is not pending",
				});
			}
			await AssignedActionModel.findByIdAndUpdate(id, {status : stateAction.abandoned});
			await UserModel.findByIdAndUpdate(assignedAction.angel, {
				tig : {
					active : true,
					time : new Date(),
				},
				isActive : false,
			});
			return res.status(200).json({
				succes : true,
				message : "Action abandoned, you are now in TIG",
			});
		} catch (err) {
			console.error(`Abandon action : \n${err}\n`);
			return res.status(500).json({
				succes : false,
				error : "Internal server error",
			});
		}
	},
	async tryDemask(req : Request, res : Response) {
		try {
			const { id } = req.params;
			const { demask } = req.body;
			const assignedAction = await AssignedActionModel.findById(id).populate('angel').lean();
			if (!assignedAction) {
				return res.status(404).json({
					succes : false,
					error : "Assigned action not found",
				});
			}
			if (assignedAction.target.toString() !== res.locals.decoded._id.toString()) {
				return res.status(401).json({
					succes : false,
					error : "You are not the target of this action",
				});
			}
			if (assignedAction.status !== stateAction.completed) {
				return res.status(400).json({
					succes : false,
					error : "This action is not completed",
				});
			}
			const config = await ConfigModel.findOne().lean();
			if (res.locals.decoded.daily.numberTryDemask >= config?.maxTryDemaskPerDay) {
				return res.status(401).json({
					succes : false,
					error : "Vous avez atteint votre limite de tentative de démasquage quotidienne",
				});
			}
			if (assignedAction.isUnmasked) {
				return res.status(400).json({
					succes : false,
					error : "This action is already unmasked",
				});
			}
			if (demask.trim() === assignedAction.angel.login) {
				await AssignedActionModel.findByIdAndUpdate(id, {isUnmasked : true});
				const user =await UserModel.findById(res.locals.decoded._id);
				user.score.revealPoint += 1;
				user.score.totalScore += 1;
				user.daily.numberTryDemasked += 1;
				await user.save();
				const angel = await UserModel.findById(assignedAction.angel._id);
				angel.score.revealedPoint += 1;
				angel.score.totalScore -= 1;
				await angel.save();
				return res.status(200).json({
					succes : true,
					message : "Démasquage réussi, l'ange a été révélé !",
				});
			} else {
				await UserModel.findByIdAndUpdate(res.locals.decoded._id, {
					$inc : {
						"daily.numberTryDemasked" : 1,
					},
				});
				return res.status(200).json({
					succes : true,
					message : "Démasquage raté, ce n'était pas le bon login !",
				});
			}
		} catch (err) {
			console.error(`Try demask : \n${err}\n`);
			return res.status(500).json({
				succes : false,
				error : "Internal server error",
			});
		}
	},
	async getAdminAssignedActions(req : Request, res : Response) {
		try {
			const assignedActions = await AssignedActionModel.find().populate('action angel target', 'login').lean();
			return res.status(200).json({
				succes : true,
				assignedActions,
			});
		} catch (err) {
			console.error(`Get admin assigned actions : \n${err}\n`);
			return res.status(500).json({
				succes : false,
				error : "Internal server error",
			});
		}
	},
}