import { Stack } from "expo-router";
import { View, StyleSheet, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === "android") {
      // Make navigation bar transparent
      NavigationBar.setBackgroundColorAsync("transparent");

      // Hide navigation bar (immersive mode)
      NavigationBar.setVisibilityAsync("hidden");

      // Allow swipe to temporarily show nav bar
      NavigationBar.setBehaviorAsync("overlay-swipe");
    }
  }, []);

  return (
    <SafeAreaProvider>
      {/* Fully control status bar */}
      <StatusBar hidden={true} />

      <View style={styles.container}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "fade",
            contentStyle: {
              backgroundColor: "#04080F", // your global app background
            },
          }}
        >
          <Stack.Screen name="index" />

          <Stack.Screen name="auth" />

          <Stack.Screen name="(tabs)" />

          <Stack.Screen name="course" />

          <Stack.Screen name="roadmaps" />
        </Stack>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#04080F",
  },
});
