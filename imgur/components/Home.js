import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text } from "react-native";
import tw from "twrnc";

export default function Home() {
    // console.log("props", getData());
    return (
      <Text
        style={tw`text-xl font-bold py-3 text-black px-10 my-3 rounded-full`}
      >
        {/* {getData()} */}
      </Text>
    );
}