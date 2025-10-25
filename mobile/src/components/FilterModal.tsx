import {
    View,
    Pressable,
    Text,
    TextInput,
    StyleSheet,
    FlatList,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { X, Search } from "lucide-react-native"
import { lightTheme } from "@/components/Themes"
import { useState } from "react"
import { DatePicker } from "./DatePicker"
import { useFilters } from "@/context/FilterContext"



interface FilterModalProps {
    modalVisible: boolean
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>
}


export const FilterModal = ({ modalVisible, setModalVisible }: FilterModalProps) => {
    const [sportQuery, useSportQuery] = useState("")
    const [selected, setSelected] = useState<string>("sport")
    const [date, setDate] = useState(new Date())


    if (!modalVisible) return null
    return (
        modalVisible &&
        <SafeAreaView className="bg-bgDark w-full h-full p-3 flex-col justify-around transition-all duration-300">
            <View className="flex-row justify-end">
                <Pressable
                    className="aspect-square rounded-full bg-bgLight p-1"
                    onPress={() => { setModalVisible(false) }}
                >
                    <X color={lightTheme.text} />
                </Pressable>
            </View>

            <SportFilter selected={selected} setSelected={setSelected} />

            <DateFilter selected={selected} setSelected={setSelected} />

            <AgeFilter selected={selected} setSelected={setSelected} />

            <LocationFilter selected={selected} setSelected={setSelected} />
            
            <View className="h-[10%] flex-row justify-between">
                <Pressable>
                    <Text>Reset Filters</Text>

                </Pressable>
                <Pressable>
                    <Text>Search</Text>

                </Pressable>
            </View>
        </SafeAreaView>
    )
}

interface SportListProps {
    sports: string[]
}

const SportList = ({ sports }: SportListProps) => {

    return (
        <FlatList
            data={sports}
            renderItem={({ item }) => (
                <Pressable>

                </Pressable>
            )}
            keyExtractor={(item, index) => index.toString()}


        />
    )

}

interface FilterProps {
    selected: string
    setSelected: React.Dispatch<React.SetStateAction<string>>
}

const SportFilter = ({ selected, setSelected }: FilterProps) => {
    return (
        <>
            {
                selected === "sport" ?
                    <Pressable
                        className={`bg-bg transition-all duration-300`}
                        style={[
                            styles.filtersContainer,
                            styles.sportFiltersContainer,
                            { height: selected === "sport" ? "50%" : "9%" },
                        ]}>
                        <Text className="color-text font-extrabold text-2xl">What Sport?</Text>

                        <View
                            className="px-2 w-full flex-row gap-x-3 items-center h-[45px]"
                            style={[styles.searchBar,
                            ]}>


                            <Search color={lightTheme.textMuted} />
                            <TextInput
                                placeholder="Search"
                                placeholderTextColor={lightTheme.textMuted}
                                placeholderClassName="font-bold"
                                className="color-textMuted font-bold"
                                autoFocus={true} />
                        </View>
                    </Pressable>
                    :
                    <Pressable className={`bg-bg transition-all duration-300`}
                        style={[styles.filtersContainer,
                        { height: selected === "sport" ? "50%" : "9%" }
                        ]}
                        onPress={() => setSelected("sport")}>
                        <Text className="color-text">Sport</Text>
                        <View>
                            <Text className="color-text font-bold">Add </Text>
                        </View>
                    </Pressable>

            }
        </>
    )

}

const DateFilter = ({ selected, setSelected }: FilterProps) => {
    return (
        <>
            {
                selected === "date" ?
                    <Pressable className={`bg-bg transition-all duration-300`}
                        style={[styles.expandedFiltersContainer,
                        { height: selected === "date" ? "50%" : "9%" }
                        ]}
                    >
                        <View className="flex-col w-full">
                            <Text className="color-text font-extrabold text-2xl">When?</Text>
                            <DatePicker />
                        </View>
                    </Pressable>
                    :
                    // Collapsed Version
                    <Pressable className={`bg-bg transition-all duration-300`}
                        style={[styles.filtersContainer,
                        { height: selected === "date" ? "50%" : "9%" }
                        ]}
                        onPress={() => setSelected("date")}>
                        <Text className="color-text">Date Range</Text>
                        <View>
                            <Text className="color-text font-bold">Add dates</Text>
                        </View>
                    </Pressable>

            }
        </>
    )

}

const AgeFilter = ({ selected, setSelected }: FilterProps) => {
    return (
        <>
            {
                selected === "age" ?

                    <Pressable
                        className={`bg-bg transition-all duration-300`}
                        style={[styles.expandedFiltersContainer,
                        { height: selected === "age" ? "50%" : "9%" }
                        ]}>
                        <View className="flex-col">
                            <Text className="color-text font-extrabold text-2xl">What is your age?</Text>
                        </View>


                    </Pressable> :
                    <Pressable
                        className={`bg-bg transition-all duration-300`}
                        style={[styles.filtersContainer,
                        { height: selected === "age" ? "50%" : "9%" }
                        ]}
                        onPress={() => setSelected("age")}
                    >
                        <Text className="color-textMuted">Age</Text>
                        <View>
                            <Text className="color-text font-bold">Add age</Text>
                        </View>

                    </Pressable>
            }
        </>
    )
}


const LocationFilter = ({ selected, setSelected }: FilterProps) => {
    return (
        <>
            {
                selected === "location" ?

                    <Pressable
                        className={`bg-bg transition-all duration-300`}
                        style={[styles.expandedFiltersContainer,
                        { height: selected === "location" ? "50%" : "9%" }
                        ]}>
                        <View className="flex-col">
                            <Text className="color-text font-extrabold text-2xl">Where?</Text>
                        </View>


                    </Pressable> :
                    <Pressable
                        className={`bg-bg transition-all duration-300`}
                        style={[styles.filtersContainer,
                        { height: selected === "location" ? "50%" : "9%" }
                        ]}
                        onPress={() => setSelected("location")}
                    >
                        <Text className="color-textMuted">Location</Text>
                        <View>
                            <Text className="color-text font-bold">Add Location</Text>
                        </View>

                    </Pressable>
            }</>
    )
}





const styles = StyleSheet.create({
    filtersContainer: {
        shadowColor: lightTheme.border,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4, // Android only
        borderRadius: 24,
        backgroundColor: lightTheme.bg,
        borderWidth: 3,
        borderColor: lightTheme.bg,
        borderTopColor: lightTheme.highlight,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 15
    },
    expandedFiltersContainer: {
        shadowColor: lightTheme.border,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4, // Android only
        borderRadius: 24,
        backgroundColor: lightTheme.bg,
        borderWidth: 3,
        borderColor: lightTheme.bg,
        borderTopColor: lightTheme.highlight,
        alignItems: "flex-start",
        flexDirection: "row",
        justifyContent: "flex-start",
        padding: 15
    },
    sportFiltersContainer: {
        alignItems: "flex-start",
        flexDirection: "column",
        justifyContent: "flex-start",
        rowGap: 20,
    },
    searchBar: {
        shadowColor: lightTheme.border,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4, // Android only
        borderRadius: 24,
        backgroundColor: lightTheme.bgLight,
        borderWidth: 3,
        borderColor: lightTheme.bgLight,
        borderTopColor: lightTheme.highlight
    },
    dateSelector: {
        shadowColor: lightTheme.border,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4, // Android only
        borderRadius: 12,
        backgroundColor: lightTheme.bgLight,
        borderWidth: 3,
        borderColor: lightTheme.bgLight,
        borderTopColor: lightTheme.highlight
    }
})
