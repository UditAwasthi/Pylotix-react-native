import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      {/* This View acts as your Global Frame. 
          The paddingHorizontal here will affect every screen in the app.
      */}
      <View style={styles.appContainer}>
        <Stack screenOptions={{ headerShown: false }}>
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
  appContainer: {
    flex: 1,
    backgroundColor: "#020205", // Matches your Dark Theme
    paddingVertical: 15,      // Adjust this number for more/less gap
  },
});