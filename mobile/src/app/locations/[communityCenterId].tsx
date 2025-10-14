import { useState, useEffect } from "react"
import { Text, View} from "react-native"
import { ResultCards } from "../../components/ResultCards"
import { useLocalSearchParams } from "expo-router";
import { useDropIns } from "@/context/DropInsContext";
import { useFilters } from "@/context/FilterContext";
import { SafeAreaView } from "react-native-safe-area-context";

import Constants from 'expo-constants';
const SERVER_API = Constants.expoConfig?.extra?.SERVER_API;

interface CommunityCenterData {
    LocationId: number
    ParentLocationId: string
    LocationName: string
    LocationType: string
    Accessibility: string
    Intersection: string
    TTCInformation: string
    District: string
    StreetNo: string
    StreetNoSuffix: string
    StreetName: string
    StreetType: string
    StreetDirection: string
    PostalCode: string
    Description: string
    error?: string
}


const CommunityCenter = () => {
    //
    const { communityCenterId } = useLocalSearchParams<{
        communityCenterId?: string | string[];
    }>();
    const id = Array.isArray(communityCenterId) ? communityCenterId[0] : communityCenterId;
    // Extracted Id
    console.log(id)

    const [communityCenterData, setCommunityCenterData] = useState<CommunityCenterData | { error: string }>()
    const { dropIns } = useDropIns()
    const { filters, setFilters } = useFilters()

    // need to set locationId to communityCenterId before rendering dropIns results
    useEffect(() => {
        if (!id) return;
        setFilters(prev => {
            if (prev.locationId === Number(id)) return prev; // ✅ prevent redundant update
            return { ...prev, locationId: Number(id) };
        });
    }, [id, setFilters]);


    // Fetch community center data

    useEffect(() => {
        if (!id) return; // ✅ Safety check

        const fetchCommunityCenterData = async () => {
            try {
                const res = await fetch(`${SERVER_API}locations/${id}`);
                if (!res.ok) throw new Error("Error connecting to server");

                const data: CommunityCenterData = await res.json(); // 
                setCommunityCenterData(data);
            } catch (err) {
                console.error("Failed to fetch community center:", err);
            }
        };

        fetchCommunityCenterData();
    }, [id]); // 




    if (!communityCenterData) return <Text>Loading Community Center...</Text>
    if ("error" in communityCenterData) return <Text>{communityCenterData.error}</Text>

    return (
        <SafeAreaView className="flex flex-col min-h-screen p-3">
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


        </SafeAreaView>
    )
}
export default CommunityCenter

