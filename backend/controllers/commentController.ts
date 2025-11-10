import { Request, Response, NextFunction } from "express";
import { getCommentsByDropInId, updateComment } from "../services/commentService";

// GET /comments/:dropInId
export const getCommentsByDropIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { dropInId } = req.params;

        if (!dropInId) {
            return res.status(400).json({ error: "Drop In ID is required" });
        }

        const commentResults = await getCommentsByDropInId({ dropInId });

        if (!commentResults || commentResults.length === 0) {
            return res.status(404).json({ error: "No comments found" });
        }

        return res.status(200).json(commentResults);
    } catch (error) {
        console.error("Error fetching comments:", error);
        next(error); // pass to global error handler
    }
};

// POST /comments
export const postComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("Comments endpoint received:", req.body);

        const { Content, DropInId, UserId } = req.body;

        // Basic validation
        if (!Content || !DropInId || !UserId) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const response = await updateComment({ Content, DropInId, UserId });

        return res.status(201).json({
            success: true,
            message: "Comment created successfully",
            data: response
        });
    } catch (error) {
        console.error("Error creating comment:", error);
        next(error);
    }
};