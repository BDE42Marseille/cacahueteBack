import AssignedActionModel from "../../models/AssignedActionModel.js";
import UserModel from "../../models/UserModel.js";

export async function resetPlayer() {
    try {
        await UserModel.updateMany({}, {
            $set: {
                "daily.numberActions": 0,
                "daily.numberTryDemasked": 0,
            },
        });
		await AssignedActionModel.updateMany({ status: 1 }, {
            $set: {
                status: 4,
            },
        });
    } catch (err) {
        console.error(`Error resetting players: ${err}`);
    }
}