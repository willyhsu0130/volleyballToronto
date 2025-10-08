import {
  View,
  Text,
  TextInput,
  Button
} from "react-native"

import { useState, useEffect } from "react"
import { useLocalSearchParams } from "expo-router"
import { ResultCards } from '../components/ResultCards'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Modal } from "./Modal";


import { useFilters } from "@/context/FilterContext";
import { useDropIns } from "@/context/DropInsContext";
import { ModalProvider, useModal } from "@/context/ModalContext";


import { Search } from "lucide-react-native"


const DropIns = () => {
  const searchParams = useLocalSearchParams<{
    sports?: string;
    age?: string;
    beginDate?: string;
    endDate?: string;
  }>();

  // States Declaration
  const [query, setQuery] = useState("")
  const sportsFromUrl = searchParams.sports
  const [modalVisible, setModalVisible] = useState(false)

  // Load from Context(s)
  const { setFilters, } = useFilters() // Load filter from the context
  const { dropIns, loading } = useDropIns()

  // Need to update filters.sports immediately
  useEffect(() => {
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

  if (loading) return <Text>Loading Drop Ins...</Text>

  return (
    <ModalProvider>
      <Modal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      >
        <SafeAreaView className="p-3 flex flex-col h-full">

          <View className="h-[8%] justify-start">
            <Text className="font-bold text-[25px]">Drop Ins</Text>
          </View>

          <View className="flex-1 flex-col gap-y-3">
            <SearchBar
              className="bg-[#262626] rounded-xl px-5 flex flex-row items-center gap-x-3 h-[55px]"
              setModalVisible={setModalVisible} />
          </View>

          {ResultCards && <ResultCards
            className="h-[81%]"
            list={dropIns}
            linkToLocation={true}
          />}

        </SafeAreaView>
      </Modal>
    </ModalProvider>
  )

}
interface SearchBarProps {
  className: string;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const SearchBar = ({ className, setModalVisible }: SearchBarProps) => {

  const { filters } = useFilters()
  const [searchInput, setSearchInput] = useState(filters?.sports)

  const handleSearchInputChange = (text: string) => {
    setSearchInput([text]);
  }


  return (
    <View className={`${className}`}>
      <Search color={"white"} />
      <TextInput
        className="color-white"
        onChangeText={handleSearchInputChange}
        placeholder="Search for a sport or sports"
        placeholderTextColor={"white"}
        onFocus={() => setModalVisible(true)}
      />
    </View>
  )
}


export default DropIns