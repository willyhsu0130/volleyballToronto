import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { ResultCards } from "../components/ResultCards"
import { Calendar } from "../components/Calendar"
import { GoogleMaps } from "../components/GoogleMaps"

const REACT_APP_SERVER_API = process.env.REACT_APP_SERVER_API

const CommunityCenter = () => {
    const { communityCenterId } = useParams()
    const [loading, setLoading] = useState(true);
    const [communityCenterData, setCommunityCenterData] = useState(null)
    const [dropIns, setDropIns] = useState([])
    const [address, setAddress] = useState()

    const [filters, setFilter] = useState({
        sport: "Volleyball",
        age: "",
        beginDate: "",
        endDate: "",
        locationId: communityCenterId
    })


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
            // Fetch all the drop in this location
        }

        const fetchDropIns = async () => {
            const params = new URLSearchParams()
            if (filters.beginDate) params.append("beginDate", filters.beginDate)
            if (filters.beginDate) params.append("endDate", filters.endDate)
            if (filters.age) params.append("age", filters.age)
            if (filters.locationId) params.append("locationId", filters.locationId)

            const url = `${REACT_APP_SERVER_API}times/${filters.sport}?${params.toString()}`
            console.log("URL", url)
            fetch(url)
                .then((res) => res.json())
                .then((data) => {
                    setDropIns(data)
                    setLoading(false);
                    console.log("Fetched data:", data)
                })
                .catch((err) => {
                    console.error("Error fetching drop-ins:", err)
                    setLoading(false);
                })

        }
        fetchCommunityCenter()
        fetchDropIns()
    }, [communityCenterId, filters])

    // Set Address
    useEffect(() => {
        if (!communityCenterData || communityCenterData.error){
            console.log("Cannot get center data")
            return;
        } 
        setAddress(
            `${communityCenterData.StreetNo ?? ""} ${communityCenterData.StreetName ?? ""} ${communityCenterData.StreetType ?? ""}, ${communityCenterData.PostalCode ?? ""}, ${communityCenterData.District ?? ""}`.trim()
        );
    }, [communityCenterData]);
    
    if (loading) return <p>Loading drop-ins...</p>;
    if (!communityCenterData) return <p>Loading community center...</p>
    if (communityCenterData.error) return <p>{communityCenterData.error}</p>

    console.log(dropIns)
    return (
        <div className="flex flex-col h-full overflow-y-auto">
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
            <div className="flex-1">
                <GoogleMaps />
            </div>
            <div className="flex-1 bg-black flex">
                <ResultCards className="w-[40%] h-full p-3 overflow-y-auto flex flex-col gap-y-3"
                    list={dropIns}
                    linkToLocation={false}
                />
                <Calendar className="w-[60%] flex flex-col bg-white p-5 items-center justify-center font-bold" />
            </div>
        </div>
    )
}

export default CommunityCenter