import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/authMiddleware.js";
import { getCommentsByDropInId, updateComment, toggleCommentLike } from "../services/commentService.js";
import { AppError } from "../utils/classes.js";
import { sendSuccess } from "../utils/helpers.js";

// GET /comments/:dropInId
export const getCommentsByDropIn = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { dropInId } = req.params;

        const userId = req.user?.userId;
        
        if (!dropInId) throw new AppError("DropIn ID is required", 400)

        const commentResults = await getCommentsByDropInId({ UserId: userId, DropInId: Number(dropInId) });
        if (!commentResults || commentResults.length === 0) return sendSuccess(res, "No comments found", 200)

        return sendSuccess(res, "Comments found", 200, commentResults)
    } catch (error) {
        next(error); // pass to global error handler
    }
};

// POST /comments
export const postComment = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { Content, DropInId } = req.body;

        const userId = req.user?.userId;
        if (!userId) throw new AppError("User not authenticated", 401)

        if (!Content || !DropInId) throw new AppError("Missing required field", 400)

        const createdComment = await updateComment({
            Content: Content,
            DropInId: DropInId,
            UserId: userId
        });
        if (!createdComment) throw new AppError("Error creating comment", 403)

        return sendSuccess(res, "Comment created successfully", 201)

    } catch (error) {
        next(error);
    }
};

export const postCommentLike = async (req: AuthRequest, res: Response, next: NextFunction) => {
    console.log("postCommentLike called")
    try {
        const { commentId } = req.body;

        const userId = req.user?.userId;
        if (!userId) throw new AppError("User not authenticated", 401);
        if (!commentId) throw new AppError("Missing commentId", 400);

        // Toggle like
        const updatedComment = await toggleCommentLike({
            CommentId: commentId,
            UserId: userId
        });

        return sendSuccess(res, "Updated like state", 202, updatedComment,);
    } catch (error) {
        next(error);
    }
};