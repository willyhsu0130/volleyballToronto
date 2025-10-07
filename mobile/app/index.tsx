import { View, TextInput } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import '../global.css';

export default function App() {

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView
        className="flex-1 flex-col w-screen bg-white"
        edges={['top', 'left', 'right']}>
        <View className="h-[90%] flex flex-col items-center">
          <TextInput
            placeholder='What do you want to play today?'
            className="border rounded-full p-4 w-[80%]"
          />
        </View>
      </SafeAreaView>
    </View>
  );
}