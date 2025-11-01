import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable
} from "react-native"

import { useState, useEffect, useLayoutEffect } from "react"
import { useLocalSearchParams } from "expo-router"
import { ResultCards } from '../components/ResultCards'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from "@react-navigation/native";
import { useFilters } from "@/context/FilterContext";
import { useDropIns } from "@/context/DropInsContext";
import { Search } from "lucide-react-native"
import { FilterModal } from "@/components/FilterModal";
import { Announcement } from "@/components/Announcement";
import { lightTheme } from "@/components/Themes";


const DropIns = () => {
  const searchParams = useLocalSearchParams<{
    sports?: string;
    age?: string;
    beginDate?: string;
    endDate?: string;
  }>();

  // States Declaration
  const sportsFromUrl = searchParams.sports
  const [modalVisible, setModalVisible] = useState(false)
  // Load from Context(s)
  const { setFilters, query } = useFilters() // Load filter from the context
  const { dropIns, loading } = useDropIns()
  const getQuery = () => {
    return query
  }

  // Need to update filters.sports immediately
  useEffect(() => {
    // Clear filter first
    if (sportsFromUrl) {
      setFilters(prev => {
        // only update if different
        if (prev.sports.includes(sportsFromUrl)) return prev;
        return {
          ...prev,
          sports: [sportsFromUrl],
        };
      });
    }
  }, [setFilters, sportsFromUrl])


  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarStyle: modalVisible ? { display: "none" } : undefined,
    });
  }, [modalVisible, navigation]);

  if (loading) return (
    <Announcement
      message="Loading Drop Ins..."
      type={"info"}
    />
  )

  return (
    <SafeAreaView className="flex-1 p-4 bg-bgDark">

      <View className="flex-[0.1] flex-col gap-y-3">
        <Pressable
          className="p-2 w-full flex-row gap-x-3 items-center h-[45px]"
          style={styles.searchBar}
          onPress={() => setModalVisible(true)}>
          <Search color={lightTheme.textMuted} />
          <Text className="color-textMuted font-bold">{getQuery()}</Text>
        </Pressable>
      </View>

      {ResultCards && <ResultCards
        className="flex-[0.9]"
        list={dropIns}
        linkToLocation={true}
      />}


      {/* absolute filter screen */}
      <View pointerEvents="box-none"
        className="absolute top-0 left-0 w-screen h-screen z-50"
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
        <FilterModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}>
        </FilterModal>
      </View>
    </SafeAreaView>
  )

}
const styles = StyleSheet.create({
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
  }
})
export default DropIns