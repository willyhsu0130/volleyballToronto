import {
    View,
    Text,
    TouchableOpacity,
    FlatList
} from "react-native"
import { Link } from "expo-router";
import { useDropIns } from "@/context/DropInsContext";

interface ResultCardProp {
    item: {
        BeginDate?: string
        EndDate?: string
        CourseTitle?: string
        LocationId?: number
        LocationName?: string
        AgeMin?: number | "None"
        AgeMax?: number | "None"
    };
    linkToLocation: boolean
}

const ResultCard = ({ item, linkToLocation }: ResultCardProp) => {
    if (!item.BeginDate || !item.EndDate) return null;

    const begin = new Date(item.BeginDate)
    const end = new Date(item.EndDate)

    const formattedDateTime = begin.toLocaleString("en-CA", {
        timeZone: "America/Toronto",
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });

    const formattedEndTime = end.toLocaleTimeString("en-CA", {
        timeZone: "America/Toronto",
        hour: "numeric",
        minute: "2-digit",
    });

    return (
        <TouchableOpacity activeOpacity={0.8} className="bg-white p-4 rounded shadow mb-2">
            <Text className="font-bold text-lg">{item.CourseTitle}</Text>
            {linkToLocation ? (
                <Link href={`/locations/${item.LocationId}`}>
                    <Text className="text-gray-700 underline">{item.LocationName} {item.LocationId}</Text>
                </Link>
            ) : (
                <Text className="text-gray-700">{item.LocationName}</Text>
            )}
            <View className="flex-row">
                <Text className="text-sm text-gray-500 mr-4">
                    {formattedDateTime} - {formattedEndTime}
                </Text>
                <Text className="text-sm text-gray-500">
                    {item.AgeMax == null || item.AgeMax === 0 || item.AgeMax === "None"
                        ? `${item.AgeMin}+`
                        : `${item.AgeMin} - ${item.AgeMax}`}
                </Text>
            </View>

        </TouchableOpacity>
    )
}

interface ResultCardsProps {
    className: string;
    list: object[];
    linkToLocation: boolean;
}


export const ResultCards = ({
    className,
    linkToLocation }: ResultCardsProps) => {
    const { dropIns } = useDropIns();
    if (!Array.isArray(dropIns)) {
        console.warn("list is not an array: ", dropIns)
        return (
            <View>
                <Text>No Program Found</Text>
            </View>
        )
    }
    return (
        <View className={className}>
            <Text className="text-black font-bold mb-2">Search Results ({dropIns.length})</Text>
            <FlatList
                data={dropIns}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <ResultCard item={item} linkToLocation={linkToLocation} />
                )}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

export default ResultCards