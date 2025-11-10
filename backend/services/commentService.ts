
import { Comment } from "../models/Comment.js"
import { CommentType } from "../models/Comment.js";

export const getCommentsByDropInId = async ({ dropInId }: { dropInId: number }) => {
    const commentResults = await Comment.find(
        { DropInId: dropInId }
    ).sort({ createdAt: -1 })
        .lean()

    return commentResults;
}

export const updateComment = async ({ Content, DropInId, UserId }: CommentType) => {
    let updateResults = await Comment.insertOne({
        DropInId: DropInId,
        UserId: UserId,
        Content: Content
    })
    console.log(updateResults)
}
