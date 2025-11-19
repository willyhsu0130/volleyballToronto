
import { Comment } from "../models/Comment.js"
import { CommentType } from "../models/Comment.js";

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
}

export const getCommentsByDropInId = async ({ DropInId }: { DropInId: number }) => {
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

        userId: c.UserId?._id?.toString(),
        username: c.UserId?.username// extracted
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
