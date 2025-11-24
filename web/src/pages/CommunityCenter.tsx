import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { ResultCards } from "../components/ResultCards"
import { CalendarSchedule } from "../components/CalendarSchedule"
import { GoogleMapsEmbed } from "../components/GoogleMaps"
import { useFilters } from "../context/FiltersContext"
import { useDropIns } from "../context/DropInContext"
import { fetchLocationById } from "../services/fetchers"

const REACT_APP_SERVER_API = process.env.REACT_APP_SERVER_API

interface CommunityCenterType {
    LocationId: number;
    ParentLocationId?: number;
    LocationName: string; // required
    LocationType?: string;
    Accessibility?: string;
    Intersection?: string;
    TTCInformation?: string;
    District?: string;
    StreetNo?: string;
    StreetNoSuffix?: string;
    StreetName?: string;
    StreetType?: string;
    StreetDirection?: string;
    PostalCode?: string;
    Description?: string;
}


const CommunityCenter = () => {
    const { communityCenterId } = useParams()
    const [error, setError] = useState<string | null>(null)
    const [communityCenterData, setCommunityCenterData] = useState<CommunityCenterType | null>(null)
    const [loading, setLoading] = useState(true)
    const { setLocationId } = useFilters()

    useEffect(() => {
        if (!communityCenterId) return // safety check

        const fetchCommunityCenter = async () => {
            const response = await fetchLocationById(Number(communityCenterId))
            if (response.data) setCommunityCenterData(response.data)
            setLoading(false)
        }

        fetchCommunityCenter()
    }, [communityCenterId])


    const isStillLoading = !communityCenterData || loading || error;
    if (isStillLoading) return (
        <div className="flex justify-center">
            <p>Loading...</p>
        </div>
    )
    // if (communityCenterData.error) return <p>{communityCenterData.error}</p>

    return (
        <div className="flex flex-col min-h-screen overflow-y-auto">
            <div className="h-[15%] p-5 bg-gray-300 ">
                <h1 className="text-[35px] font-bold">{communityCenterData?.LocationName}</h1>
                <p className="text-gray-700 leading-relaxed">
                    <span className="font-semibold"></span>{" "}
                    {communityCenterData?.StreetNo}{" "}
                    {communityCenterData?.StreetName}{" "}
                    {communityCenterData?.StreetType},{" "}
                    {communityCenterData?.PostalCode},{" "}
                    {communityCenterData?.District}
                </p>
            </div>
            {communityCenterData &&
                <GoogleMapsEmbed address={communityCenterData.LocationName} className="h-[60vh]" />}
            <div className=" bg-black flex flex-1">
                <ResultCards className="w-[40%] h-full p-3 overflow-y-auto flex flex-col gap-y-3"
                    linkToLocation={false}
                />
                <CalendarSchedule className="w-[60%] flex flex-col bg-white p-5 items-center justify-center font-bold" />
            </div>
        </div>
    )
}

export default CommunityCenter