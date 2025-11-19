import { User, IUser } from "../models/User.js";
import { AppError } from "../utils/classes.js";
import mongoose from "mongoose";

export const getProfileByUserId = async ({ UserId }: { UserId: string | undefined }) => {
    // Validate input
    if (!UserId) throw new AppError("UserId is required", 400);

    if (!mongoose.isValidObjectId(UserId)) {
        throw new AppError("Invalid UserId format", 400);
    }

    // Fetch user
    const user = await User.findById(UserId)
        .select("_id username email role createdAt") // choose fields
        .lean();

    if (!user) throw new AppError("User not found", 404);


    return user; // returns clean JSON (not a Mongoose document)
};