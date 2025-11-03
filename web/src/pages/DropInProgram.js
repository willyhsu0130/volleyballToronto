import { useState, useEffect } from "react"
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom"
import { ResultCards } from "../components/ResultCards"
import { CalendarSchedule } from "../components/CalendarSchedule"
import { GoogleMapsEmbed } from "../components/GoogleMaps"
import { useFilters } from "../context/FiltersContext"
import { useDropIns } from "../context/DropInContext"
import { Comments } from "../components/Comments";



const DropInProgram = () => {

    const { dropInId } = useParams()

    const { fetchDropInById, loading } = useDropIns()
    const [dropIn, setDropIn] = useState(null)
    const [comments, setComments] = useState(null)

    useEffect(() => {
        const runFetch = async () => {
            const dropInresults = await fetchDropInById(dropInId)
            setDropIn(dropInresults)
            setComments(dropInresults.commentResults)
        }
        runFetch()
    }, [fetchDropInById, dropInId])

    console.log(dropIn)


    return (
        <div className="">
            <p className="text-3xl">{dropIn?.CourseTitle} </p>
            <Link to={`../locations/${dropIn?.LocationId}`}>
                <p className="hover: underline"> at {dropIn?.LocationRef?.LocationName}</p>
            </Link>


            {dropInId}
            {dropIn?.Age}
            {dropIn?.BeginDate}
            {dropIn?.EndDate}
            <Comments comments={comments} dropInId={dropInId} />
        </div>
    )
}


export default DropInProgram