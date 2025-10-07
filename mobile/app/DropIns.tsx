import {
  View,
  Text,
  TextInput
} from "react-native"
import { useState, useEffect } from "react"
import { useLocalSearchParams } from "expo-router"
import Constants from 'expo-constants';
import { ResultCards } from '../components/ResultCards'


const SERVER_API = Constants.expoConfig?.extra?.SERVER_API;

const DropIns = () => {
  const searchParams = useLocalSearchParams<{
    sports?: string;
    age?: string;
    beginDate?: string;
    endDate?: string;
    location?: string;
  }>();

  const sportsFromUrl = searchParams.sports
  const [dropIns, setDropIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("")

  const [filters, setFilter] = useState({
    sports: sportsFromUrl || ["Volleyball"],
    age: "",
    beginDate: "",
    endDate: "",
    location: "",
  });

  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.beginDate) params.append("beginDate", filters.beginDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    if (filters.age) params.append("age", filters.age);
    if (filters.location) params.append("location", filters.location);

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
  }, [filters])
  if (loading) return <Text>Loading Drop Ins...</Text>


  return (
    <View className="gap-y-3 p-2">
      <SearchBar
        className="border border-black rounded-full p-1"
        setFilter={setFilter}
        filters={filters} />
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
  filters: {
    sports: string | string[];
    age: string;
    beginDate: string;
    endDate: string;
    location: string;
  };
  setFilter: React.Dispatch<React.SetStateAction<{
    sports: string | string[];
    age: string;
    beginDate: string;
    endDate: string;
    location: string;
  }>>;
}

const SearchBar = ({ className, setFilter, filters }: SearchBarProps) => {
  const [searchInput, setSearchInput] = useState(filters?.sports)

  const handleSearchInputChange = (text: string) => {
    setSearchInput(text);
  }

  return (
    <View className={`${className}`}>
      <View>
        <TextInput
          onChangeText={handleSearchInputChange}
          placeholder="Search for a sport of sports"
        />

      </View>
    </View>
  )


}



export default DropIns