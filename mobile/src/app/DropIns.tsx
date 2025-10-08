import {
  View,
  Text,
  TextInput
} from "react-native"

import { useState, useEffect } from "react"
import { useLocalSearchParams } from "expo-router"
import { ResultCards } from '../components/ResultCards'

import { useFilters } from "@/context/FilterContext";
import { useDropIns } from "@/context/DropInsContext";


const DropIns = () => {
  const searchParams = useLocalSearchParams<{
    sports?: string;
    age?: string;
    beginDate?: string;
    endDate?: string;
  }>();

  const sportsFromUrl = searchParams.sports

  // const [query, setQuery] = useState("")
  const { setFilters, } = useFilters() // Load filter from the context
  const { dropIns, loading} = useDropIns()

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
    <View className="gap-y-3 p-2">
      <SearchBar
        className="border border-black text-black font-bold rounded-xl p-2" />
      {ResultCards && <ResultCards
        className=""
        list={dropIns}
        linkToLocation={true}
      />}
    </View>
  )

}
interface SearchBarProps {
  className: string;
}

const SearchBar = ({ className }: SearchBarProps) => {

  const { filters } = useFilters()
  const [searchInput, setSearchInput] = useState(filters?.sports)

  const handleSearchInputChange = (text: string) => {
    setSearchInput([text]);
  }

  return (
    <View className={`${className}`}>
      <View>
        <TextInput
          onChangeText={handleSearchInputChange}
          placeholder="Search for a sport or sports"
        />
      </View>
    </View>
  )


}

export default DropIns