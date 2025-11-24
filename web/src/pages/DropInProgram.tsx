import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { DropIn } from "../context/DropInContext";
import { Comments, CommentType } from "../components/Comments";
import { fetchCommentsByDropInId, fetchDropInById } from "../services/fetchers";

// Turn location names into slugs for filename matching
const slugify = (str: string) =>
    str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

const buildImageCandidates = (locationId: number, locationName: string) => {
    const slug = slugify(locationName);

    return [
        // Most accurate guess (gymnasium + slug)
        `https://www.toronto.ca/ext/pfr/img/${locationId}/gymnasium-${slug}.jpg`,
        `https://www.toronto.ca/ext/pfr/img/${locationId}/${slug}-gymnasium.jpg`,
        `https://www.toronto.ca/ext/pfr/img/${locationId}/${locationId}-gymnasium-${slug}.jpg`,
        `https://www.toronto.ca/ext/pfr/img/${locationId}/gym-${slug}.jpg`,

        // Generic fallback filenames:
        `https://www.toronto.ca/ext/pfr/img/${locationId}/gymnasium.jpg`,
        `https://www.toronto.ca/ext/pfr/img/${locationId}/gym.jpg`,

        // LAST generic fallback
        `https://www.toronto.ca/ext/pfr/img/${locationId}/${locationId}.jpg`,

        // Default app fallback
        `/default-gym.jpg`,
    ];
};

const DropInProgram = () => {
    const { dropInId } = useParams();
    const [dropIn, setDropIn] = useState<DropIn | null>(null);
    const [comments, setComments] = useState<CommentType[]>([]);
    const [imgIndex, setImgIndex] = useState(0);

    // Fallback through candidate image URLs
    const imageCandidates =
        dropIn != null
            ? buildImageCandidates(dropIn.LocationId, dropIn.LocationName || "")
            : [];

    const handleImageError = () => {
        setImgIndex((prev) =>
            prev + 1 < imageCandidates.length ? prev + 1 : prev
        );
    };

    useEffect(() => {
        const runFetch = async () => {
            const dropInResults = await fetchDropInById(Number(dropInId));
            if (dropInResults.data) setDropIn(dropInResults.data);

            const commentResults = await fetchCommentsByDropInId(Number(dropInId));
            if (commentResults.data) setComments(commentResults.data);
        };

        runFetch();
    }, [dropInId]);

    return (
        <div>
            {/* Title */}
            <p className="text-3xl font-semibold">{dropIn?.CourseTitle}</p>

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
            <p>{imageCandidates[imgIndex]}</p>

            {/* Image with fallback */}
            {dropIn && (
                <img
                    src={imageCandidates[imgIndex]}
                    onError={handleImageError}
                    alt={`${dropIn.LocationName} gym`}
                    className="w-full max-w-3xl my-4 rounded"
                />
            )}

            <p className="text-3xl mt-6">Event similar to this</p>

            {/* Comments */}
            <Comments comments={comments} dropInId={Number(dropInId)} />
        </div>
    );
};

export default DropInProgram;