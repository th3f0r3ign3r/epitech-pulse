// import { StatusBar } from 'expo-status-bar';
import React from "react";
import {
  Text,
  View,
  Image,
  // FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import Fontisto from "react-native-vector-icons/Fontisto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Home from "./components/Home";
import Profile from "./components/Profile";
import tw from "twrnc";
import axios from "axios";
import {
  makeRedirectUri,
  ResponseType,
  useAuthRequest,
} from "expo-auth-session";

const Tab = createBottomTabNavigator();

const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    // console.log("store", jsonValue);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    // saving error
  }
};

export default function App() {
  const [login, setLogin] = React.useState(false);
  // const [params, setParams] = React.useState("false");

  const discovery = {
    authorizationEndpoint: "https://api.imgur.com/oauth2/authorize",
    tokenEndpoint: "https://api.imgur.com/oauth2/token",
  };

  const [request, response, connect] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: "30f4239331e6190",
      redirectUri: makeRedirectUri({
        scheme: "exp://10.50.10.250:19000",
      }),
    },
    discovery
  );

  React.useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;

      console.log(access_token);
      setLogin(true);

      storeData("user_infos", response.params);
      // setParams(response.params);
      // console.log(params.account_username);
      // setToken(access_token);
      // getprofile(access_token);
    }
  }, [response && login != true]);

  return (
    <NavigationContainer>
      {login ? (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              if (route.name === "Home") {
                return <Feather name="inbox" size={size} color={color} />;
              } else if (route.name === "Discovery") {
                return <Fontisto name="compass" size={size} color={color} />;
              } else if (route.name === "Create") {
                return <Ionicons name="ios-add" size={size} color={color} />;
              } else if (route.name === "Chat") {
                return <AntDesign name="message1" size={size} color={color} />;
              } else if (route.name === "Profile") {
                return <Feather name="user" size={size} color={color} />;
              }
            },
            tabBarActiveTintColor: "#295eba",
            tabBarInactiveTintColor: "gray",
          })}
        >
          <Tab.Screen name="Home" component={Home} />

          {/* <Tab.Screen name="Home" component={Home} /> */}
          {/* <Tab.Screen name="Discovery" component={SettingsScreen} /> */}
          {/* <Tab.Screen name="Create" component={SettingsScreen} />
          <Tab.Screen name="Chat" component={SettingsScreen} /> */}
          {/* <Tab.Screen name="Profile" component={Profile} /> */}
        </Tab.Navigator>
      ) : (
        <SafeAreaView
          style={tw`bg-[#0a0a0a] h-full flex items-center justify-center`}
        >
          <StatusBar
            animated={true}
            barStyle={"light-content"}
            showHideTransition={"fade"}
            // hidden={hidden}
          />
          <Image
            source={{
              uri: "https://play-lh.googleusercontent.com/hYdIazwJBlPhmN74Yz3m_jU9nA6t02U7ZARfKunt6dauUAB6O3nLHp0v5ypisNt9OJk",
            }}
            style={tw`w-60 h-60 rounded-full`}
          />
          <Pressable
            style={tw`flex items-center justify-center mt-32`}
            disabled={!request}
            onPress={() => connect()}
            title="Connect to Imgur"
            accessibilityLabel="Learn more about this purple button"
          >
            <Text
              style={tw`text-xl font-bold py-3 bg-[#01b96b] text-white px-10 my-3 rounded-full`}
            >
              CONNEXION
            </Text>
          </Pressable>
        </SafeAreaView>
      )}
    </NavigationContainer>
  );
}
