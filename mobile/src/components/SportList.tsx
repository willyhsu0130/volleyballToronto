import {
    FlatList,
    View,
    Text,
    StyleSheet,
    Pressable
} from "react-native"

import {
    ReactNode,
    useState
} from "react";

import { useFilters } from "@/context/FilterContext";
import { Volleyball, Icon } from "lucide-react-native"
import { basketball, batBall, soccerBall } from '@lucide/lab';
import { lightTheme } from "./Themes";

interface Sport {
    sport: string
    logo: ReactNode
}

interface SportListProps {
    sportQuery: string
    setSelected: React.Dispatch<React.SetStateAction<string>>
}

export const SportList = ({ sportQuery, setSelected }: SportListProps) => {
    const { filters, setSports } = useFilters()
    const { sports } = filters
    const sportList = [
        { sport: "Volleyball", logo: <Volleyball size={40} /> },
        { sport: "Basketball", logo: <Icon iconNode={basketball} size={40} /> },
        { sport: "Table Tennis", logo: <Icon iconNode={batBall} size={40} /> },
        { sport: "Soccer", logo: <Icon iconNode={soccerBall} size={40} /> }
    ]

    const filteredSportList = sportList.filter(item =>
        item.sport.toLowerCase().includes(sportQuery.toLowerCase())
    );


    const handleOnPress = (sport: string) => {
        setSelected("date")
        setSports([sport])
    }


    return (
        <View className="w-full">
            <FlatList<Sport>
                keyExtractor={(item, index) => index.toString()}
                data={filteredSportList}
                renderItem={({ item }) => (
                    <SportListItem sport={item.sport} logo={item.logo} handleOnPress={handleOnPress} />
                )}
            />
        </View>

    )
}

interface SportListItemProps {
    sport: string
    logo: ReactNode
    handleOnPress: (sports: string) => void

}


const SportListItem = ({ sport, logo, handleOnPress }: SportListItemProps) => {
    return (
        <Pressable className="flex-row items-center gap-x-3"
            style={styles.SportListItemContainer}
            onPress={() => handleOnPress(sport)}
        >
            <View className="rounded-xl aspect-square bg-bgDark p-2">{logo}</View>
            <Text>{sport}</Text>
        </Pressable>
    )
}


const styles = StyleSheet.create({
    SportListItemContainer: {
        width: "100%",
        paddingVertical: 5,
    }

})
