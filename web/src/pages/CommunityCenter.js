import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { ResultCards } from "../components/ResultCards"
import { CalendarSchedule } from "../components/CalendarSchedule"
import { GoogleMapsEmbed } from "../components/GoogleMaps"
import { useFilters } from "../context/FiltersContext"
import { useDropIns } from "../context/DropInContext"

const REACT_APP_SERVER_API = process.env.REACT_APP_SERVER_API

const CommunityCenter = () => {
    const { communityCenterId } = useParams()
    const [communityCenterData, setCommunityCenterData] = useState(null)
    const { dropIns, loading } = useDropIns()
    const { setLocationId } = useFilters()

    useEffect(() => {
        if (!communityCenterId) return // safety check

        const fetchCommunityCenter = async () => {
            try {
                // Fetch Community Center Locations
                const url = `${REACT_APP_SERVER_API}locations/${communityCenterId}`
                const res = await fetch(url)
                if (!res.ok) throw new Error("Failed to fetch community center data")

                const data = await res.json()
                setCommunityCenterData(data)

                console.log("Data fetched:", data)
            } catch (err) {
                console.error(err)
                setCommunityCenterData({ error: "Error retrieving data" })
            }
        }
        setLocationId(communityCenterId)
        fetchCommunityCenter()
    }, [communityCenterId])


    const isStillLoading = !communityCenterData || loading || communityCenterData.error;
    if (isStillLoading) return (
        <div className="flex justify-center">
            <p>Loading...</p>
        </div>
    )
    // if (communityCenterData.error) return <p>{communityCenterData.error}</p>

    return (
        <div className="flex flex-col min-h-screen overflow-y-auto">
            <div className="h-[15%] p-5 bg-gray-300 ">
                <h1 className="text-[35px] font-bold">{communityCenterData.LocationName}</h1>
                <p className="text-gray-700 leading-relaxed">
                    <span className="font-semibold"></span>{" "}
                    {communityCenterData.StreetNo}{" "}
                    {communityCenterData.StreetName}{" "}
                    {communityCenterData.StreetType},{" "}
                    {communityCenterData.PostalCode},{" "}
                    {communityCenterData.District}
                </p>
            </div>
            {communityCenterData &&
                <GoogleMapsEmbed address={communityCenterData.LocationName} className="h-[60vh]" />}
            <div className=" bg-black flex flex-1">
                <ResultCards className="w-[40%] h-full p-3 overflow-y-auto flex flex-col gap-y-3"
                    list={dropIns}
                    linkToLocation={false}
                />
                <CalendarSchedule className="w-[60%] flex flex-col bg-white p-5 items-center justify-center font-bold" />
            </div>
        </div>
    )
}

export default CommunityCenter