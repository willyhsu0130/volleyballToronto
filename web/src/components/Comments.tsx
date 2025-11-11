import { useState, useEffect } from "react";
import { useDropIns } from "../context/DropInContext";
import { ThumbsUp } from "lucide-react"


export interface CommentType {
    _id?: string;
    DropInId: number;
    UserId: number;
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
    const userId = 1; // temporary
    const [commentField, setCommentField] = useState("");
    const [localComments, setLocalComments] = useState(comments ?? []);

    useEffect(() => {
        if (comments) {
            setLocalComments(comments);
        }
    }, [comments]);

    const { submitComment } = useDropIns();

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => setCommentField(e.target.value);

    const handleSubmitComment = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!commentField.trim()) return;

        const tempComment = {
            DropInId: dropInId,
            UserId: userId,
            Content: commentField.trim(),
        }

        setLocalComments((prev) => [tempComment, ...prev,])
        setCommentField("");

        try {
            submitComment(tempComment)
        } catch (error) {
            console.log(error)
        }
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
                <p>{item.UserId}</p>
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