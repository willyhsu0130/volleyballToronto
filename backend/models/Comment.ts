import mongoose from "mongoose";

export type CommentType = {
  DropInId: number
  UserId: number
  Content: string
}

const commentSchema = new mongoose.Schema(
  {
    DropInId: {
      type: Number,
      ref: "DropIn",
      required: true
    },

    UserId: {
      type: Number,
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
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);