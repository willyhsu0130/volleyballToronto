import { useState, useEffect } from "react"
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom"
import { useDropIns, DropIn } from "../context/DropInContext.tsx"
import { Comments, CommentType } from "../components/Comments.tsx";

const DropInProgram = () => {

    const { dropInId } = useParams()

    const { fetchDropInById, fetchCommentsByDropInId } = useDropIns()
    const [dropIn, setDropIn] = useState<DropIn | null>(null)
    const [comments, setComments] = useState<CommentType[]>([])

    useEffect(() => {
        const runFetch = async () => {
            const dropInResults = await fetchDropInById(Number(dropInId))
            const commentResults = await fetchCommentsByDropInId(Number(dropInId))
            console.log("commentResults", commentResults)
            if (dropInResults) setDropIn(dropInResults)
            if (commentResults) setComments(commentResults)
        }
        runFetch()
    }, [fetchDropInById, fetchCommentsByDropInId, dropInId])

    console.log(dropIn)


    return (
        <div className="">
            <p className="text-3xl">{dropIn?.CourseTitle} </p>
            <Link to={`../locations/${dropIn?.LocationId}`}>
                <p className="hover: underline"> at {dropIn?.LocationName}</p>
            </Link>

            {dropIn?.AgeMax}
            {dropIn?.BeginDate}
            {dropIn?.EndDate}
            <Comments comments={comments} dropInId={Number(dropInId)} />
        </div>
    )
}


export default DropInProgram