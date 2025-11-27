import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DropIn as IDropIn } from "../context/DropInContext";
import { Comments, CommentType } from "./Comments";
import { fetchCommentsByDropInId, fetchDropInById } from "../services/fetchers";
import { KnownError } from "./classes/ErrorClass";

export const DropIn = ({ dropInId, className }: { dropInId: number | undefined, className: string }) => {
    const [dropIn, setDropIn] = useState<IDropIn | null>(null);
    const [comments, setComments] = useState<CommentType[]>([]);
    // const [imgIndex, setImgIndex] = useState(0);
     useEffect(() => {
        const runFetch = async () => {
            const dropInResults = await fetchDropInById(Number(dropInId));
            if(!dropInResults.success) throw new KnownError("DropInId not found")
            if (dropInResults.data) setDropIn(dropInResults.data);

            const commentResults = await fetchCommentsByDropInId(Number(dropInId));
            if (commentResults.data) setComments(commentResults.data);
        };

        runFetch();
    }, [dropInId]);
    if(!dropInId) return (
        <div className="flex justify-center items-center">
            <p className="text-white">Select a program!</p>
        </div>

    )

    
    // Fallback through candidate image URLs
   

    return (
        <div className={`${className}`}>
            {/* Title */}
                <p className="text-3xl font-semibold">{dropIn?.CourseTitle}</p>
                <div className="w-full border border-black h-full">

                </div>
                {/* Location Link */}
                {dropIn && (
                    <Link to={`../locations/${dropIn.LocationId}`}>
                        <p className="hover:underline">
                            at {dropIn.LocationName}
                        </p>
                    </Link>
                )}

                {/* Info */}
                <p>Age Max: {dropIn?.AgeMax}</p>
                <p>Starts: {dropIn?.BeginDate}</p>
                <p>Ends: {dropIn?.EndDate}</p>
                <p>LocationId: {dropIn?.LocationId}</p>

                {/* Image with fallback */}
                {/* {dropIn && (
                // <img
                //     src={imageCandidates[imgIndex]}
                //     onError={handleImageError}
                //     alt={`${dropIn.LocationName} gym`}
                //     className="w-full max-w-3xl my-4 rounded"
                // />
            )} */}

                <p className="text-3xl mt-6">Event similar to this</p>

                {/* Comments */}
                <Comments comments={comments} dropInId={Number(dropInId)} />
        </div>
    );
};