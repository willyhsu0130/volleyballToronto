import {
  View,
  Text
} from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from "react";
import Constants from 'expo-constants';
import '../global.css';
import { Volleyball, Search } from "lucide-react-native"

const SERVER_API = Constants.expoConfig?.extra?.SERVER_API;

export default function App() {
  const [query, setQuery] = useState("")
  const handleSearch = () => {

  }

  useEffect(() => {
    const url = `${SERVER_API}times/`
    fetch(url)
  }, [])

  // Warm server

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView
        className="flex-1 flex-col w-screen bg-white"
        edges={['left', 'right']}>
        <View className="h-full flex flex-col items-center justify-start">
          <View className="w-full bg-[#262626] rounded-3xl h-[30%] flex flex-col justify-center px-10">
            <Text className="text-[25px]/10 font-bold color-white tracking-wider">
              What do you want {"\n"}to play today?
            </Text>
          </View>
          <Link href="/DropIns" className="w-[90%] -mt-[27px]">
            <View className="bg-slate-100 rounded-xl px-5 w-full flex flex-row items-center gap-x-3 h-[55px]">
              <Search className="" color={`#9c9c9c`} />
              <Text className="font-bold color-[#9c9c9c]">Search Drop Ins</Text>
            </View>
          </Link>
          <View className="flex flex-col gap-y-5 w-full px-10 pt-6 bg-[5682B1]">
            <View className="flex flex-row justify-start">
              <Text className="font-bold text-[25px]">Sports</Text>
            </View>
            <View>
              <Volleyball size={50}/>
            </View>

          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

