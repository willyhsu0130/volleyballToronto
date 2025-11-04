import { useState, useEffect } from "react";
import { useDropIns } from "../context/DropInContext";
import { ThumbsUp } from "lucide-react"

export const Comments = ({ comments, dropInId }) => {
    const userId = 1; // temporary
    const commentUserId = 1;
    const [commentField, setCommentField] = useState("");
    const [localComments, setLocalComments] = useState(comments ?? []);

    useEffect(() => {
        if (comments) {
            setLocalComments(comments);
        }
    }, [comments]);

    const { submitComment } = useDropIns();

    const handleOnChange = (e) => setCommentField(e.target.value);

    const handleSubmitComment = (e) => {
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
            const response = submitComment(tempComment)
            if (!response) throw new Error("Something wrong with submitting comment")
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
                {localComments?.map((item, index) => (
                    <Comment key={index} item={item} />
                ))}
            </div>

        </div>
    );
};

const Comment = ({ item }) => {
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