import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function HomeScreen() {
  const handleLogout = async () => {
    await AsyncStorage.removeItem("accessToken");

    router.replace("/auth");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
        />

        <Text style={styles.title}>Welcome to Pylotix</Text>

        <Text style={styles.subtitle}>Your dashboard is ready.</Text>
      </View>
      <TouchableOpacity
        style={{
          marginTop: 20,
          backgroundColor: "#2563EB",
          padding: 15,
          borderRadius: 10,
        }}
        onPress={() => router.push("/createRoadmap")}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
          }}
        >
          Create Roadmap
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 60,
  },

  content: {
    alignItems: "center",
    marginTop: 100,
  },

  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: 16,
    color: "#64748B",
    marginTop: 5,
  },

  logoutButton: {
    borderWidth: 1,
    borderColor: "#FF3B30",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
  },

  logoutText: {
    color: "#FF3B30",
    fontWeight: "bold",
  },
});
