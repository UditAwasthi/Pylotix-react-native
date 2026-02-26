import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import { MotiView } from "moti";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MONO = Platform.OS === "ios" ? "Menlo" : "monospace";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const isDark = useColorScheme() === "dark";

  const theme = {
    background: "#020205", // Deep black
    inputBg: "rgba(255, 255, 255, 0.03)",
    text: "#FFFFFF",
    accent: "#00F2FE", // Cyan
    muted: "rgba(255, 255, 255, 0.4)",
    border: "rgba(0, 242, 254, 0.2)",
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("SYSTEM_ERROR", "Credentials required for uplink.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("https://st-v01.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        await AsyncStorage.setItem("accessToken", data.accessToken);
        router.replace("../(tabs)/home");
      } else {
        Alert.alert("ACCESS_DENIED", data.message);
      }
    } catch {
      Alert.alert("CONNECTION_FAILURE", "Neural server unreachable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* SECURE HEADER */}
          <MotiView
            from={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={styles.header}
          >
            <View style={[styles.logoFrame, { borderColor: theme.border }]}>
              <Image
                source={require("../../assets/images/logo.png")}
                style={styles.logo}
              />
            </View>
            <Text style={[styles.mono, styles.version]}>SECURE_ACCESS_V4</Text>
            <Text style={[styles.title, { color: theme.text }]}>
              UPLINK_SESSION
            </Text>
            <View style={styles.separator} />
          </MotiView>

          {/* TERMINAL FORM */}
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 300 }}
            style={styles.form}
          >
            {/* EMAIL INPUT */}
            <View
              style={[
                styles.inputWrapper,
                { borderColor: theme.border, backgroundColor: theme.inputBg },
              ]}
            >
              <View style={styles.inputLabel}>
                <Text
                  style={[styles.mono, { color: theme.accent, fontSize: 8 }]}
                >
                  IDENTIFIER
                </Text>
              </View>
              <View style={styles.inputRow}>
                <Feather
                  name="mail"
                  size={16}
                  color={theme.accent}
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="USER@NEURAL_LINK"
                  placeholderTextColor={theme.muted}
                  style={[
                    styles.input,
                    { color: theme.text, fontFamily: MONO },
                  ]}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* PASSWORD INPUT */}
            <View
              style={[
                styles.inputWrapper,
                { borderColor: theme.border, backgroundColor: theme.inputBg },
              ]}
            >
              <View style={styles.inputLabel}>
                <Text
                  style={[styles.mono, { color: theme.accent, fontSize: 8 }]}
                >
                  ACCESS_KEY
                </Text>
              </View>
              <View style={styles.inputRow}>
                <Feather
                  name="lock"
                  size={16}
                  color={theme.accent}
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor={theme.muted}
                  secureTextEntry
                  style={[
                    styles.input,
                    { color: theme.text, fontFamily: MONO },
                  ]}
                  onChangeText={setPassword}
                />
              </View>
            </View>

            {/* LOGIN BUTTON */}
            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.button, { backgroundColor: theme.accent }]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={[styles.mono, styles.buttonText]}>
                {loading ? "ESTABLISHING..." : "INITIALIZE_UPLINK"}
              </Text>
              <MaterialCommunityIcons
                name="connection"
                size={18}
                color="black"
              />
            </TouchableOpacity>

            {/* FOOTER ACTIONS */}
            <TouchableOpacity
              onPress={() => router.replace("/signup")}
              style={styles.signupLink}
            >
              <Text style={[styles.mono, { color: theme.muted, fontSize: 11 }]}>
                NEW_USER?{" "}
                <Text style={{ color: theme.accent }}>CREATE_IDENTITY</Text>
              </Text>
            </TouchableOpacity>
          </MotiView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mono: { fontFamily: MONO, letterSpacing: 2, fontWeight: "700" },
  scrollContent: { flexGrow: 1, justifyContent: "center", padding: 30 },
  header: { alignItems: "center", marginBottom: 50 },
  logoFrame: {
    width: 90,
    height: 90,
    borderWidth: 1,
    padding: 15,
    marginBottom: 20,
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  logo: { width: "100%", height: "100%", resizeMode: "contain" },
  version: { fontSize: 9, color: "rgba(0, 242, 254, 0.4)", marginBottom: 5 },
  title: { fontSize: 24, fontWeight: "200", letterSpacing: 6 },
  separator: {
    height: 1,
    width: 40,
    backgroundColor: "#00F2FE",
    marginTop: 20,
  },

  form: { width: "100%" },
  inputWrapper: {
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
    position: "relative",
  },
  inputLabel: {
    position: "absolute",
    top: -7,
    left: 10,
    backgroundColor: "#020205",
    paddingHorizontal: 5,
  },
  inputRow: { flexDirection: "row", alignItems: "center", height: 40 },
  inputIcon: { marginRight: 15 },
  input: { flex: 1, fontSize: 13 },

  button: {
    height: 60,
    borderRadius: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 12,
    shadowColor: "#00F2FE",
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  buttonText: { color: "black", fontSize: 12, fontWeight: "900" },
  signupLink: { marginTop: 30, alignItems: "center" },
});
