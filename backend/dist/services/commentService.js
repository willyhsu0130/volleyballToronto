import { Comment } from "../models/Comment.js";
export const getCommentsByDropInId = async ({ DropInId }) => {
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
        userId: c.UserId?._id?.toString(),
        username: c.UserId?.username // extracted
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
