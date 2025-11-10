
import { Comment } from "../models/Comment.js"

export const getCommentsByDropInId = async ({ dropInId }) => {
    const commentResults = await Comment.find(
        { DropInId: dropInId }
    ).sort({ createdAt: -1 })
        .lean()

    return commentResults;
}


export const updateComment = async ({ Content, DropInId, UserId }) => {
    let updateResults = await Comment.insertOne({
        DropInId: DropInId,
        UserId: UserId,
        Content: Content
    })
    console.log(updateResults)
}
