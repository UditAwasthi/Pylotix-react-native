import { useEffect } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  useEffect(() => {
    check();
  }, []);

  async function check() {
    const token = await AsyncStorage.getItem("accessToken");

    if (token) {
      router.replace("/(tabs)/home");
    } else {
      router.replace("/auth/WelcomeScreen");
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
