import {
  View,
  Text
} from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from "react";
import Constants from 'expo-constants';
import '../global.css';
import { Volleyball, } from "lucide-react-native"

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
        edges={['top', 'left', 'right']}>
        <View className="h-[90%] flex flex-col items-center justify-center gap-y-10 p-5">
          <View className="w-[80%]">
            <Text className="text-[30px] font-bold">
              What do you want to play today?
            </Text>
          </View>
          <Link
            href="/DropIns"
            className="border rounded-xl p-4 w-[80%]"
          >Search</Link>
          <View className="flex flex-row">
            <Volleyball />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}