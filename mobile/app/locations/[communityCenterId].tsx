import { useState, useEffect } from "react"
import { Text, View } from "react-native"
import { ResultCards } from "../../components/ResultCards"
import { useLocalSearchParams } from "expo-router";
import Constants from "expo-constants";

const SERVER_API = Constants.expoConfig?.extra?.SERVER_API;

const CommunityCenter = () => {
    const { communityCenterId } = useLocalSearchParams()
    console.log(communityCenterId)
    const [loading, setLoading] = useState(true);
    const [communityCenterData, setCommunityCenterData] = useState(null)
    const [dropIns, setDropIns] = useState([])

    const [filters, setFilter] = useState({
        sport: "Volleyball",
        age: "",
        beginDate: "",
        endDate: "",
        locationId: communityCenterId
    })
    useEffect(() => {
        // Safety Check
        if (!communityCenterId) return

        // Fetch community centers from API
        const fetchCommunityCenter = async () => {
            try {
                const url = `${SERVER_API}locations/${communityCenterId}`
                const res = await fetch(url)
                if (!res.ok) throw new Error("Failed to fetch community center information")

                const data = await res.json()
                setCommunityCenterData(data)

                console.log("Data fetched: ", data)
                setCommunityCenterData(data)


            } catch (err) {
                console.log(err)
                setCommunityCenterData({ error: "Error retrieving data" })
            }


        }

        const fetchDropIns = async () => {
            try {
                const params = new URLSearchParams()
                if (filters.beginDate) params.append("beginDate", filters.beginDate)
                if (filters.beginDate) params.append("endDate", filters.endDate)
                if (filters.age) params.append("age", filters.age)
                if (filters.locationId) params.append("locationId", filters.locationId)

                const url = `${SERVER_API}times/${filters.sport}?${params.toString()}`
                console.log("URL", url)
                const res = await fetch(url)
                if (!res.ok) throw new Error("Failed to fetch Drop Ins")

                const data = await res.json()
                setDropIns(data)
                setLoading(false)
                console.log("Fetched data:", data)

            } catch (err) {
                console.error("Error fetching Drop Ins", err)
                setLoading(false)

            }

        }
        fetchCommunityCenter()
        fetchDropIns()

    }, [communityCenterId, filters])
    if (!communityCenterData) return <Text>Loading Community Center...</Text>
    if (communityCenterData.error) return <Text>{communityCenterData.error}</Text>

    return (
        <View className="flex flex-col min-h-screen p-2">
            <View className="h-[15%]">
                <Text className="text-3xl font-bold">{communityCenterData.LocationName}</Text>
                <Text className="text-gray-700 leading-relaxed">
                    {communityCenterData.StreetNo}{" "}
                    {communityCenterData.StreetName}{" "}
                    {communityCenterData.StreetType},{" "}
                    {communityCenterData.PostalCode},{" "}
                    {communityCenterData.District}
                </Text>
            </View>
            <View>
                <ResultCards
                    className="p-3"
                    list={dropIns}
                    linkToLocation={false}
                />
            </View>


        </View>
    )
}
export default CommunityCenter

