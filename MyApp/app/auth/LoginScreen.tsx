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
  ActivityIndicator,
} from "react-native";
import { MotiView } from "moti";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts, Marcellus_400Regular } from "@expo-google-fonts/marcellus";
import {
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

export default function IndustryStandardLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const isDark = useColorScheme() === "dark";

  let [fontsLoaded] = useFonts({
    Marcellus_400Regular,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  const theme = {
    background: isDark ? "#04080F" : "#F5F9FF",
    card: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.8)",
    border: isDark ? "rgba(0, 122, 255, 0.2)" : "rgba(0, 122, 255, 0.1)",
    primary: "#007AFF",
    text: isDark ? "#FFFFFF" : "#1C1C1E",
    muted: isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(28, 28, 30, 0.6)",
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("SYSTEM_ERROR", "Credentials required.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("https://st-v01.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password: password,
        }),
      });

      const data = await res.json();

      if (res.ok && data?.accessToken) {
        await AsyncStorage.setItem("accessToken", data.accessToken);
        router.replace("/(tabs)/home");
      } else {
        Alert.alert("ACCESS_DENIED", data.message || "Verification failed.");
      }
    } catch (err) {
      Alert.alert("CONNECTION_FAILURE", "Server unreachable.");
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <SafeAreaView style={{ flex: 1 }}>
        {/* ANIMATED BACK BUTTON */}
        <MotiView
          from={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", delay: 200 }}
          style={styles.backButtonWrapper}
        >
          <TouchableOpacity
            onPress={() => router.replace("/auth/WelcomeScreen")}
            style={[
              styles.backButton,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={20} color={theme.text} />
          </TouchableOpacity>
        </MotiView>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <MotiView
              from={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              style={styles.header}
            >
              <View
                style={[
                  styles.logoFrame,
                  { borderColor: theme.border, backgroundColor: theme.card },
                ]}
              >
                <Image
                  source={require("../../assets/images/logo.png")}
                  style={styles.logo}
                />
              </View>
              <Text
                style={[
                  styles.version,
                  { color: theme.primary, fontFamily: "Poppins_600SemiBold" },
                ]}
              >
                v2.0.4 SECURE_UPLINK
              </Text>
              <Text
                style={[
                  styles.title,
                  { color: theme.text, fontFamily: "Marcellus_400Regular" },
                ]}
              >
                PYLOTIX
              </Text>
              <View
                style={[styles.accentBar, { backgroundColor: theme.primary }]}
              />
            </MotiView>

            <View style={styles.form}>
              <View
                style={[
                  styles.inputContainer,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
              >
                <Feather
                  name="mail"
                  size={18}
                  color={theme.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="IDENTIFIER"
                  placeholderTextColor={theme.muted}
                  style={[
                    styles.input,
                    { color: theme.text, fontFamily: "Poppins_400Regular" },
                  ]}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  editable={!loading}
                />
              </View>

              <View
                style={[
                  styles.inputContainer,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
              >
                <Feather
                  name="lock"
                  size={18}
                  color={theme.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="ACCESS_KEY"
                  placeholderTextColor={theme.muted}
                  secureTextEntry={!showPassword}
                  style={[
                    styles.input,
                    { color: theme.text, fontFamily: "Poppins_400Regular" },
                  ]}
                  onChangeText={setPassword}
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Feather
                    name={showPassword ? "eye" : "eye-off"}
                    size={18}
                    color={theme.muted}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.premiumButton,
                  {
                    backgroundColor: theme.primary,
                    opacity: loading ? 0.7 : 1,
                  },
                ]}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Initialize Session</Text>
                    <MaterialCommunityIcons
                      name="connection"
                      size={20}
                      color="#FFF"
                    />
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push("/signup")}
                style={styles.signupLink}
              >
                <Text
                  style={[
                    styles.loginText,
                    { color: theme.text, fontFamily: "Poppins_400Regular" },
                  ]}
                >
                  New Entity?{" "}
                  <Text style={{ color: theme.primary, fontWeight: "700" }}>
                    Create Link
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.securityBadge}>
              <MaterialCommunityIcons
                name="shield-check"
                size={14}
                color={theme.primary}
              />
              <Text
                style={[
                  styles.securityText,
                  { color: theme.muted, fontFamily: "Poppins_400Regular" },
                ]}
              >
                End-to-End Encrypted Environment
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  // Wraps the MotiView to ensure z-indexing and layout
  backButtonWrapper: {
    position: "absolute",
    top: 25, // Increased padding from top
    left: 20,
    zIndex: 100,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    // Adding subtle shadow for the glass effect
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
    }),
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 30,
    paddingTop: 60,
  },
  header: { alignItems: "center", marginBottom: 40 },
  logoFrame: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: { width: 50, height: 50, resizeMode: "contain" },
  version: { fontSize: 9, letterSpacing: 2, marginBottom: 10 },
  title: { fontSize: 32, letterSpacing: 10 },
  accentBar: { width: 30, height: 2, borderRadius: 1, marginTop: 15 },
  form: { width: "100%", gap: 15 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 20,
  },
  inputIcon: { marginRight: 15 },
  input: { flex: 1, fontSize: 14 },
  premiumButton: {
    height: 60,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  signupLink: { marginTop: 25, alignItems: "center" },
  loginText: { fontSize: 13 },
  securityBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 40,
  },
  securityText: { fontSize: 10, letterSpacing: 0.3 },
});
