import { useState, useEffect } from "react"
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom"
import { DropIn } from "../context/DropInContext"
import { Comments, CommentType } from "../components/Comments";
import { fetchCommentsByDropInId, fetchDropInById } from "../services/fetchers";

const DropInProgram = () => {

    const { dropInId } = useParams()

    const [dropIn, setDropIn] = useState<DropIn | null>(null)
    const [comments, setComments] = useState<CommentType[]>([])

    useEffect(() => {
        const runFetch = async () => {
            const dropInResults = await fetchDropInById(Number(dropInId))
            console.log(dropInResults)
            if (dropInResults.data) setDropIn(dropInResults.data)

            const commentResults = await fetchCommentsByDropInId(Number(dropInId))
            console.log(commentResults)
            if (commentResults.data) setComments(commentResults.data)
        }
        runFetch()
    }, [dropInId])

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