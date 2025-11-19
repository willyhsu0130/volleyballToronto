
import { Comment } from "../models/Comment.js"
import { CommentType } from "../models/Comment.js";
import { AppError } from "../utils/classes.js";
import mongoose from "mongoose";


export interface PopulatedUser {
    _id: string;
    username: string;
}

export interface PopulatedComment {
    _id?: string;
    DropInId: number;
    Content: string;
    createdAt?: string;
    updatedAt?: string;
    UserId: PopulatedUser; // <-- IMPORTANT
    Likes: string[];
}

export const getCommentsByDropInId = async ({ DropInId, UserId }: { DropInId: number, UserId: string | undefined}) => {
    const comments = await Comment.find({ DropInId })
        .populate("UserId", "username")
        .sort({ createdAt: -1 })
        .lean<PopulatedComment[]>();

    return comments.map(c => ({
        _id: c._id,
        DropInId: c.DropInId,
        Content: c.Content,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,

        UserId: c.UserId?._id?.toString(),
        Username: c.UserId?.username,  // extracted

        LikesCount: c.Likes?.length ?? 0,
        LikedByUser: c.Likes?.some((id: any) => id.toString() === UserId) ?? false
    }));
}

export const updateComment = async ({ Content, DropInId, UserId }: CommentType) => {
    let updateResults = await Comment.insertOne({
        DropInId: DropInId,
        UserId: UserId,
        Content: Content
    })
    console.log(updateResults)
    return updateResults
}

export const toggleCommentLike = async ({
    CommentId,
    UserId
}: {
    CommentId: string;
    UserId: string;
}) => {
    const comment = await Comment.findById(CommentId);
    if (!comment) throw new AppError("Comment not found", 404);

    const hasLiked = comment.Likes.some(
        (id: any) => id.toString() === UserId
    );

    const userObjectId = new mongoose.Types.ObjectId(UserId);

    if (hasLiked) {
        // Remove like
        comment.Likes = comment.Likes.filter(
            (id: any) => id.toString() !== UserId
        );
    } else {
        // Add like
        comment.Likes.push(userObjectId);
    }

    await comment.save();
    return comment;
};