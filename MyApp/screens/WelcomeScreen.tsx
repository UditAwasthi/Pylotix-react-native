import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function WelcomeScreen() {

  const handleContinue = () => {
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>

      <Image
        source={require("./../assets/images/logo.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>
        Pylotix
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleContinue}
      >
        <Text style={styles.buttonText}>
          Continue
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#0B0F1A",
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 140,
    height: 140,
    marginBottom: 20,
    resizeMode: "contain",
  },

  title: {
    fontSize: 32,
    color: "white",
    fontWeight: "bold",
    marginBottom: 60,
  },

  button: {
    backgroundColor: "#4F46E5",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 10,
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },

});