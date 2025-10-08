import {
  View,
  Text,
  TextInput
} from "react-native"

import { useState, useEffect } from "react"
import { useLocalSearchParams } from "expo-router"
import { ResultCards } from '../components/ResultCards'
import Constants from 'expo-constants';

import { useFilters } from "@/context/FilterContext";


const SERVER_API = Constants.expoConfig?.extra?.SERVER_API;

const DropIns = () => {
  const searchParams = useLocalSearchParams<{
    sports?: string;
    age?: string;
    beginDate?: string;
    endDate?: string;
  }>();

  // sportFromUrl is a string
  const sportsFromUrl = searchParams.sports
  const [dropIns, setDropIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("")


  const { filters, setFilters, } = useFilters()


  // Need to update filters.sports immediately./
  useEffect(() => {

    if (sportsFromUrl) {
      setFilters((prev) => {
        if (prev.sports === sportsFromUrl) return prev
        return {
          ...prev,
          sports: sportsFromUrl || ""
        }
      })
    }

    const params = new URLSearchParams()
    if (filters.beginDate) params.append("beginDate", filters.beginDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    if (filters.age) params.append("age", filters.age);
    // if (filters.location) params.append("location", filters.location);

    let sportPath = null
    if (!Array.isArray(filters.sports)) {
      sportPath = filters.sports
    }
    else {
      sportPath = filters.sports.join(",")
    }
    const url = `${SERVER_API}times/${sportPath}${params.toString()}`
    console.log(url)

    const fetchResponse = fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setDropIns(data)
        console.log(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching drop-ins", err)
        setLoading(false)
      })
    console.log(fetchResponse)
  }, [
    setFilters,
    sportsFromUrl,
    filters.age,
    filters.beginDate,
    filters.endDate,
    filters.sports
  ])
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

  const { filters, setFilters, resetFilters } = useFilters()
  const [searchInput, setSearchInput] = useState(filters?.sports)

  const handleSearchInputChange = (text: string) => {
    setSearchInput(text);
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