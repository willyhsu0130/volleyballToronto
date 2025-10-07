import {
    View,
    Text,
    TouchableOpacity,
    ScrollView
} from "react-native"
import { Link } from "expo-router";
import { linkTo } from "expo-router/build/global-state/routing";

interface ResultCardProp {
    item: {
        BeginDate?: string
        EndDate?: string
        CourseTitle?: string
        LocationId?: number
        LocationName?: string
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
                    <Text className="text-gray-700 underline">{item.LocationName}</Text>
                </Link>
            ) : (
                <Text className="text-gray-700">{item.LocationName}</Text>
            )}
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
    list,
    linkToLocation }: ResultCardsProps) => {
    if (!Array.isArray(list)) {
        console.warn("list is not an array: ", list)
        return (
            <View>
                <Text>No Program Found</Text>
            </View>
        )
    }
    return (
        <View>
            {list &&
                <ScrollView className={`${className}`}>
                    <Text className="text-white">Search Results ( {list?.length})</Text>
                    {
                        list?.map((item, index) =>(
                            <ResultCard item={item} key={index} linkToLocation={linkToLocation}/>
                        ))
                    }
                </ScrollView>
                
            }
        </View>
    )
}

export default ResultCards