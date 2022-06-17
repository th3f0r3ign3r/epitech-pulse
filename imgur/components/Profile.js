import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import tw from "twrnc";
import { View, Text, Image } from "react-native";

export default function Profile() {
  //   const [account, setAccount] = useState(null);
  const [access_token, setToken] = useState(undefined);
  let picture = "";

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("user_infos");
      setToken(JSON.parse(jsonValue));
      // return JSON.parse(jsonValue);
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    if (access_token === undefined) {
      getData();
    } else {
    //   console.log("first", typeof access_token);
      axios
        .post({
          method: "GET",
          url: "https://api.imgur.com/3/account/me/avatar",
          headers: { Auhhorization: "Bearer " + access_token.access_token },
        })
        .then((result) => (picture = result.data.avatar));
    }
  });

  return (
    <View style={tw`flex flex-row`}>
      <Image
        style={tw`w-52 h-52 rounded-full`}
        source={{ uri: picture }}
      ></Image>
      <Text>{access_token.account_username ?? picture}</Text>
    </View>
  );
}
