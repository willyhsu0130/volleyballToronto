import { View, TextInput } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from "react";
import Constants from 'expo-constants';
import '../global.css';

const SERVER_API = Constants.expoConfig?.extra?.SERVER_API;

export default function App() {
  const [query, setQuery] = useState("")
  const handleSearch = () =>{
    
  }

  useEffect(() => {
    const url = `${SERVER_API}times/`
    const response = fetch(url)
    console.log(response)
  },[])

  // Warm server

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView
        className="flex-1 flex-col w-screen bg-white"
        edges={['top', 'left', 'right']}>
        <View className="h-[90%] flex flex-col items-center">
          <Link
            href="/DropIns"
            className="border rounded-full p-4 w-[80%]"
          >What do you want to play today?</Link>
        </View>
      </SafeAreaView>
    </View>
  );
}