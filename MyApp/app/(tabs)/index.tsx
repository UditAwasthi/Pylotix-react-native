import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

import WelcomeScreen from "./WelcomeScreen";

export default function Index() {

  const [checking, setChecking] = useState(true);

  useEffect(() => {

    const checkLogin = async () => {

      const token =
        await AsyncStorage.getItem("accessToken");

      if (token) {

        router.replace("/(tabs)/home");

      }

      setChecking(false);

    };

    checkLogin();

  }, []);

  if (checking) {

    return (
      <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}>
        <ActivityIndicator size="large" />
      </View>
    );

  }

  return <WelcomeScreen />;

}