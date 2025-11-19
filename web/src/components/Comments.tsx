import { useState, useEffect } from "react";
import { ThumbsUp } from "lucide-react"
import { useAuth } from "../context/AuthContext";
import { submitComment } from "../services/fetchers";
import { KnownError } from "./classes/ErrorClass";
import { useThrowAsyncError } from "../hooks/useThrowAsyncError"


export interface CommentType {
    _id?: string;
    Username: string;
    DropInId: number;
    UserId: string;
    Content: string;
    Likes?: any[];
    createdAt?: string;
    updatedAt?: string;
    __v?: number;

}
interface CommentsProps {
    comments: CommentType[]
    dropInId: number
}

export const Comments = ({ comments, dropInId }: CommentsProps) => {
    const [commentField, setCommentField] = useState("");
    const [localComments, setLocalComments] = useState(comments ?? []);
    const { token, user } = useAuth()
    console.log(comments)
    const throwAsync = useThrowAsyncError();

    useEffect(() => {
        if (comments) {
            setLocalComments(comments);
        }
    }, [comments]);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => setCommentField(e.target.value);

    const handleSubmitComment = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!commentField.trim()) return;
        if (!user?._id) return
        const tempComment = {
            DropInId: dropInId,
            UserId: user?._id,
            Content: commentField.trim(),
            Username: user?.username
        }
        const submitResults = await submitComment({
            comment: {
                DropInId: dropInId,
                Content: commentField.trim()
            },
            token
        })
        if (!submitResults.success) {
            throwAsync(
                new KnownError(submitResults.message || "Failed to submit comment")
            );
            return;
        }

        setLocalComments((prev) => [tempComment, ...prev,])
        setCommentField("");
    };

    return (
        <div>
            <p className="font-bold text-3xl">Comments</p>

            <div className="flex">
                <div className="w-[5%]">LOGO</div>

                <div className="w-[95%]">
                    <input
                        className="w-full focus:outline-none focus:ring-0"
                        placeholder="Add a comment"
                        onChange={handleOnChange}
                        value={commentField}
                    />
                    <div id="separator" className="w-full border border-black"></div>

                    <div className="flex justify-end gap-x-5">
                        <button onClick={() => setCommentField("")}>Cancel</button>
                        <button onClick={handleSubmitComment}>Comment</button>
                    </div>
                </div>
            </div>
            <div className="">
                {localComments && localComments?.map((item, index) => (
                    <Comment key={index} item={item} />
                ))}
            </div>

        </div>
    );
};

const Comment = ({ item }: { item: CommentType }) => {
    return (
        <div className="border-b py-2 flex">
            <div>
                LOGO
            </div>
            <div>
                <p>{item.Username}</p>
                <p>{item.Content}</p>
                <p>{item.Likes}</p>
                <div className="flex gap-x-2">
                    <ThumbsUp size={20} />
                    <p>{10}</p>
                </div>

            </div>
        </div>
    );
};