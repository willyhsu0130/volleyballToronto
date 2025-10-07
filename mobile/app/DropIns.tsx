import {
  View,
  Text


} from "react-native"
import { useState, useEffect } from "react"
import { useLocalSearchParams } from "expo-router"
import Constants from 'expo-constants';
import { ResultCards } from '../components/ResultCards'


const { SERVER_API, ENV } = Constants.expoConfig.extra;

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

    const sportPath = (filters.sports || []).join(",")
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
    <View>
      {ResultCards && <ResultCards
        list={dropIns}
        linkToLocation={true}
      />}
    </View>
  )

}

export default DropIns