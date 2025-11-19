import { getCommentsByDropInId, updateComment } from "../services/commentService.js";
import { AppError } from "../utils/classes.js";
import { sendSuccess } from "../utils/helpers.js";
// GET /comments/:dropInId
export const getCommentsByDropIn = async (req, res, next) => {
    try {
        const { dropInId } = req.params;
        if (!dropInId)
            throw new AppError("DropIn ID is required", 400);
        const commentResults = await getCommentsByDropInId({ DropInId: Number(dropInId) });
        if (!commentResults || commentResults.length === 0)
            return sendSuccess(res, "No comments found", 200);
        return sendSuccess(res, "Comments found", 200, commentResults);
    }
    catch (error) {
        next(error); // pass to global error handler
    }
};
// POST /comments
export const postComment = async (req, res, next) => {
    try {
        const { Content, DropInId } = req.body;
        const userId = req.user?.userId;
        if (!userId)
            throw new AppError("User not authenticated", 401);
        if (!Content || !DropInId)
            throw new AppError("Missing required field", 400);
        const createdComment = await updateComment({
            Content: Content,
            DropInId: DropInId,
            UserId: userId
        });
        if (!createdComment)
            throw new AppError("Error creating comment", 403);
        return sendSuccess(res, "Comment created successfully", 201);
    }
    catch (error) {
        next(error);
    }
};
