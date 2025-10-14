import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity
} from "react-native";

import { Link } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { ReactNode, useEffect, useState } from "react";
import Constants from 'expo-constants';
import '../global.css';
import { Volleyball, Search } from "lucide-react-native"
import { useColorScheme } from "nativewind";
import { darkTheme, lightTheme } from "@/components/Themes";




const SERVER_API = Constants.expoConfig?.extra?.SERVER_API;


export default function App() {
  const [query, setQuery] = useState("")
  const [errorMessage, setErrorMessage] = useState()

  const handleSearch = () => {

  }
  const { colorScheme } = useColorScheme();
  console.log("Current theme:", colorScheme);

  useEffect(() => {
    const url = `${SERVER_API}`
    console.log(url)
    const loadServer = async () => {
      try {
        const res = await fetch(url)
        if (!res.ok) throw Error("Error connecting to server")
        return
      } catch (err) {
        if (err instanceof Error) {
          console.error("Error: ", err)
          return
        }
        console.error("Something went wrong")
      }
    }
    // loadServer()
  }, [])

  // Warm server

  return (
    <View className="flex-1 bg-bgDark">
      <SafeAreaView
        className="flex-1 flex flex-col w-screen bg-Dark dark:bg-dark-bg-dark p-4 justify-around"
        edges={['left', 'right', 'top']}>

        {/** First Container */}
        <View className="h-[40%] flex-col justify-center gap-y-8 px-8"
          style={colorScheme === "dark" ? styles.darkContainer : styles.lightContainer}>
          <View className="w-full rounded-3xl flex flex-col justify-center">
            <Text className="text-[28px]/10 font-bold color-text tracking-wider">
              What do you want {"\n"}to play today?
            </Text>
          </View>
          <Link href="/DropIns">
            <View className="bg-bgLight rounded-xl px-5 w-full flex flex-row items-center gap-x-3 h-[45px]"
              style={styles.lightShadow}
            >
              <Search className="" color={`#676767`} />
              <Text className="font-bold color-textMuted">Search Drop Ins</Text>
            </View>
          </Link>
        </View>

        {/** Second Container */}
        <View className="h-[55%] flex gap-y-5 w-full px-8 pt-6"
          style={styles.sports}
        >
          <SportList />
        </View>

      </SafeAreaView>
    </View>
  );
}

interface Sport {
  sport: string;
  logo: ReactNode
}

const SportListItem = ({ sport, logo }: Sport) => {
  return (
    <TouchableOpacity className="p-5 aspect-square flex flex-col justify-around 
    items-center gap-y-3 flex-1"
      style={styles.sport}>
      <Text className="text-1xl font-bold">{sport}</Text>
      {logo}
    </TouchableOpacity>

  )
}

const SportList = () => {

  const [sports, setSports] = useState<Sport[]>([
    { sport: "Volleyball", logo: <Volleyball size={60} /> },
    { sport: "Basketball", logo: <Volleyball size={60} /> },
    { sport: "Basketball", logo: <Volleyball size={60} /> },
    { sport: "Basketball", logo: <Volleyball size={60} /> }
  ])
  return (
    <FlatList<Sport>
      className="flex-row"
      keyExtractor={(item, index) => index.toString()}
      data={sports}
      renderItem={({ item }) => (
        <SportListItem sport={item.sport} logo={item.logo} />
      )}
      numColumns={2}
      contentContainerStyle={{
        flex: 1,
        gap: 16,
      }}
      columnWrapperStyle={{
        gap: 16
      }}
      showsVerticalScrollIndicator={false}
    />
  )
}


const styles = StyleSheet.create({
  sports: {
    shadowColor: lightTheme.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4, // Android only
    borderRadius: 24,
    backgroundColor: lightTheme.bg,
    borderWidth: 3,
    borderColor: lightTheme.bg,
    borderTopColor: lightTheme.highlight
  },
  sport: {
    shadowColor: lightTheme.border,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4, // Android only
    borderRadius: 24,
    backgroundColor: lightTheme.bgLight,
    borderWidth: 3,
    borderColor: lightTheme.bgLight,
    borderTopColor: lightTheme.highlight
  },
  lightShadow: {
    shadowColor: '#999999',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4, // Android only
  },

  lightContainer: {
    shadowColor: lightTheme.border,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4, // Android only
    borderRadius: 24,
    backgroundColor: lightTheme.bg,
    borderWidth: 3,
    borderColor: lightTheme.bg,
    borderTopColor: lightTheme.highlight
  },

  lightContainerTop: {
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

  darkContainer: {
    shadowColor: darkTheme.border,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4, // Android only
    borderRadius: 24,
    backgroundColor: darkTheme.bg,
    borderWidth: 3,
    borderColor: darkTheme.bg,
    borderTopColor: darkTheme.highlight
  }
})