import { Comment } from "../models/Comment.js";
import { AppError } from "../utils/classes.js";
import mongoose from "mongoose";
export const getCommentsByDropInId = async ({ DropInId, UserId }) => {
    const comments = await Comment.find({ DropInId })
        .populate("UserId", "username")
        .sort({ createdAt: -1 })
        .lean();
    return comments.map(c => ({
        _id: c._id,
        DropInId: c.DropInId,
        Content: c.Content,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        UserId: c.UserId?._id?.toString(),
        Username: c.UserId?.username, // extracted
        LikesCount: c.Likes?.length ?? 0,
        LikedByUser: c.Likes?.some((id) => id.toString() === UserId) ?? false
    }));
};
export const updateComment = async ({ Content, DropInId, UserId }) => {
    let updateResults = await Comment.insertOne({
        DropInId: DropInId,
        UserId: UserId,
        Content: Content
    });
    console.log(updateResults);
    return updateResults;
};
export const toggleCommentLike = async ({ CommentId, UserId }) => {
    const comment = await Comment.findById(CommentId);
    if (!comment)
        throw new AppError("Comment not found", 404);
    const hasLiked = comment.Likes.some((id) => id.toString() === UserId);
    const userObjectId = new mongoose.Types.ObjectId(UserId);
    if (hasLiked) {
        // Remove like
        comment.Likes = comment.Likes.filter((id) => id.toString() !== UserId);
    }
    else {
        // Add like
        comment.Likes.push(userObjectId);
    }
    await comment.save();
    return comment;
};
