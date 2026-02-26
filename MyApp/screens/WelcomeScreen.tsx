import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { MotiView } from "moti";
import { Zap, ChevronRight } from "lucide-react-native";

const MONO = Platform.OS === "ios" ? "Menlo" : "monospace";

export default function WelcomeScreen() {
  const handleContinue = () => {
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* PULSING LOGO CORE */}
      <MotiView
        from={{ scale: 0.9, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          loop: true,
          type: "timing",
          duration: 2000,
        }}
        style={styles.logoWrapper}
      >
        <Image
          source={require("./../assets/images/logo.png")}
          style={styles.logo}
        />
        {/* Decorative Ring */}
        <View style={styles.logoRing} />
      </MotiView>

      <MotiView
        from={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 300 }}
        style={styles.textContainer}
      >
        <Text style={[styles.mono, styles.version]}>SYSTEM_v4.2.0</Text>
        <Text style={styles.title}>PYLOTIX</Text>
        <View style={styles.statusContainer}>
          <Zap size={12} color="#00F2FE" />
          <Text style={[styles.mono, styles.statusText]}>
            NEURAL_LINK_READY
          </Text>
        </View>
      </MotiView>

      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 800 }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.button}
          onPress={handleContinue}
        >
          <Text style={[styles.mono, styles.buttonText]}>INITIALIZE_SYNC</Text>
          <ChevronRight size={18} color="#000" />
        </TouchableOpacity>
      </MotiView>

      {/* Decorative background element */}
      <Text style={[styles.mono, styles.footerCode]}>
        0x00452 // MEMORY_ALLOCATED // AURA_OS
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020205",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  mono: {
    fontFamily: MONO,
    letterSpacing: 2,
  },
  logoWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 160,
    height: 160,
    resizeMode: "contain",
    zIndex: 2,
  },
  logoRing: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: "rgba(0, 242, 254, 0.2)",
    borderStyle: "dashed",
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 80,
  },
  version: {
    fontSize: 10,
    color: "rgba(0, 242, 254, 0.5)",
    marginBottom: 5,
  },
  title: {
    fontSize: 42,
    color: "white",
    fontWeight: "200", // Ultra-thin look
    letterSpacing: 10,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  statusText: {
    fontSize: 10,
    color: "#00F2FE",
  },
  button: {
    backgroundColor: "#00F2FE",
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    // Glow effect
    shadowColor: "#00F2FE",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  buttonText: {
    color: "black",
    fontSize: 13,
    fontWeight: "900",
  },
  footerCode: {
    position: "absolute",
    bottom: 30,
    fontSize: 8,
    color: "rgba(255, 255, 255, 0.2)",
  },
});
