import mongoose from "mongoose";
const commentSchema = new mongoose.Schema({
    DropInId: {
        type: Number,
        ref: "DropIn",
        required: true
    },
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    Content: {
        type: String,
        required: true,
        trim: true
    },
    Likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
}, { timestamps: true });
export const Comment = mongoose.model("Comment", commentSchema);
