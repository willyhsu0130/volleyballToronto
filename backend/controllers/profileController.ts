import { Request, Response, NextFunction } from "express"
import { getProfileByUserId } from "../services/profileService.js";
import { AppError } from "../utils/classes.js";
import { AuthRequest } from "../middleware/authMiddleware.js";
import { sendSuccess } from "../utils/helpers.js";

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) throw new AppError("UserId not provided", 400)

        const data = await getProfileByUserId({ UserId: userId })

        sendSuccess(res, "Profile found", 200, data)
    } catch (err) {
        next(err);
    }
};