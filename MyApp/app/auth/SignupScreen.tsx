import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import { MotiView } from "moti";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts, Marcellus_400Regular } from "@expo-google-fonts/marcellus";
import {
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from "react-native-reanimated";

export default function SignupScreen() {
  // --- LOGIC STATES ---
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const aiApiKey = null; // Preserving your original variable

  const isDark = useColorScheme() === "dark";

  // --- FONTS ---
  let [fontsLoaded] = useFonts({
    Marcellus_400Regular,
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  // --- THEME ---
  const theme = {
    background: isDark ? "#04080F" : "#F5F9FF",
    card: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.8)",
    inputBg: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)",
    primary: "#007AFF",
    accent: "#00F2FE",
    text: isDark ? "#FFFFFF" : "#1C1C1E",
    muted: isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(28, 28, 30, 0.6)",
    border: isDark ? "rgba(0, 122, 255, 0.2)" : "rgba(0, 122, 255, 0.1)",
  };

  // --- SIGNUP LOGIC ---
  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert(
        "VALIDATION_ERROR",
        "All identification parameters required.",
      );
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("https://st-v01.onrender.com/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, aiApiKey }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("SUCCESS", "Neural identity established.");
        await AsyncStorage.setItem("accessToken", data.accessToken);
        router.replace("/(tabs)/home");
      } else {
        Alert.alert("REGISTRATION_FAILED", data.message || "Uplink rejected.");
      }
    } catch (err) {
      Alert.alert("NETWORK_ERROR", "Neural stream disconnected.");
    } finally {
      setLoading(false);
    }
  };

  // --- ANIMATION ---
  const glowPulse = useSharedValue(0);
  useEffect(() => {
    glowPulse.value = withRepeat(withTiming(1, { duration: 4000 }), -1, true);
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glowPulse.value, [0, 1], [0.1, 0.25]),
    transform: [{ scale: interpolate(glowPulse.value, [0, 1], [1, 1.1]) }],
  }));

  if (!fontsLoaded) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* BACKGROUND AMBIENT GLOWS */}
      <View style={StyleSheet.absoluteFill}>
        <Animated.View
          style={[
            styles.glowOrb,
            { backgroundColor: theme.primary, top: -50, right: -50 },
            glowStyle,
          ]}
        />
        <Animated.View
          style={[
            styles.glowOrb,
            { backgroundColor: theme.accent, bottom: -100, left: -50 },
            glowStyle,
          ]}
        />
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={styles.header}
            >
              <View
                style={[
                  styles.logoCircle,
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
                  styles.title,
                  { color: theme.text, fontFamily: "Marcellus_400Regular" },
                ]}
              >
                Create Identity
              </Text>
              <Text
                style={[
                  styles.subtitle,
                  { color: theme.muted, fontFamily: "Poppins_400Regular" },
                ]}
              >
                Register your neural signature for encrypted access
              </Text>
            </MotiView>

            <MotiView
              from={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 200 }}
              style={[
                styles.glassCard,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              {/* FULL NAME */}
              <View style={styles.inputGroup}>
                <Text
                  style={[
                    styles.label,
                    { color: theme.primary, fontFamily: "Poppins_600SemiBold" },
                  ]}
                >
                  USER_NAME
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    { backgroundColor: theme.inputBg },
                  ]}
                >
                  <Feather
                    name="user"
                    size={18}
                    color={theme.primary}
                    style={styles.icon}
                  />
                  <TextInput
                    placeholder="ENTER_FULL_NAME"
                    placeholderTextColor={theme.muted}
                    style={[
                      styles.input,
                      { color: theme.text, fontFamily: "Poppins_400Regular" },
                    ]}
                    onChangeText={setName}
                    value={name}
                    editable={!loading}
                  />
                </View>
              </View>

              {/* EMAIL */}
              <View style={styles.inputGroup}>
                <Text
                  style={[
                    styles.label,
                    { color: theme.primary, fontFamily: "Poppins_600SemiBold" },
                  ]}
                >
                  COMM_CHANNEL
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    { backgroundColor: theme.inputBg },
                  ]}
                >
                  <Feather
                    name="mail"
                    size={18}
                    color={theme.primary}
                    style={styles.icon}
                  />
                  <TextInput
                    placeholder="USER@NEURAL_LINK"
                    placeholderTextColor={theme.muted}
                    style={[
                      styles.input,
                      { color: theme.text, fontFamily: "Poppins_400Regular" },
                    ]}
                    onChangeText={setEmail}
                    value={email}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!loading}
                  />
                </View>
              </View>

              {/* PASSWORD */}
              <View style={styles.inputGroup}>
                <Text
                  style={[
                    styles.label,
                    { color: theme.primary, fontFamily: "Poppins_600SemiBold" },
                  ]}
                >
                  ACCESS_KEY
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    { backgroundColor: theme.inputBg },
                  ]}
                >
                  <Feather
                    name="lock"
                    size={18}
                    color={theme.primary}
                    style={styles.icon}
                  />
                  <TextInput
                    placeholder="ENCRYPT_PASSWORD"
                    placeholderTextColor={theme.muted}
                    secureTextEntry
                    style={[
                      styles.input,
                      { color: theme.text, fontFamily: "Poppins_400Regular" },
                    ]}
                    onChangeText={setPassword}
                    value={password}
                    editable={!loading}
                  />
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.signupButton,
                  {
                    backgroundColor: theme.primary,
                    opacity: loading ? 0.7 : 1,
                  },
                ]}
                onPress={handleSignup}
                disabled={loading}
              >
                <Text
                  style={[
                    styles.buttonText,
                    { fontFamily: "Poppins_600SemiBold" },
                  ]}
                >
                  {loading ? "INITIALIZING..." : "INITIALIZE_IDENTITY"}
                </Text>
                {!loading && (
                  <Feather name="shield" size={18} color="#FFF" />
                )}
              </TouchableOpacity>
            </MotiView>

            <TouchableOpacity
              onPress={() => router.replace("/login")}
              style={styles.footerLink}
            >
              <Text
                style={[
                  styles.footerText,
                  { color: theme.muted, fontFamily: "Poppins_400Regular" },
                ]}
              >
                ALREADY_REGISTERED?{" "}
                <Text style={{ color: theme.primary }}>RESUME_UPLINK</Text>
              </Text>
            </TouchableOpacity>

            <View style={styles.securityBadge}>
              <Feather name="shield" size={14} color={theme.primary} />
              <Text
                style={[
                  styles.securityText,
                  { color: theme.muted, fontFamily: "Poppins_400Regular" },
                ]}
              >
                End-to-End Encrypted Registration
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
  backButton: { paddingHorizontal: 25, paddingTop: 10, zIndex: 10, width: 80 },
  glowOrb: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    filter: Platform.OS === "ios" ? "blur(80px)" : undefined,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingBottom: 40,
    justifyContent: "center",
  },
  header: { alignItems: "center", marginBottom: 40 },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: { width: 40, height: 40, resizeMode: "contain" },
  title: {
    fontSize: 32,
    letterSpacing: 1.5,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    opacity: 0.8,
    letterSpacing: 1,
  },
  glassCard: {
    padding: 25,
    borderRadius: 24,
    borderWidth: 1,
    gap: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: { elevation: 5 },
    }),
  },
  inputGroup: { gap: 8 },
  label: { fontSize: 10, letterSpacing: 1.5, marginLeft: 4 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 55,
    borderRadius: 12,
    paddingHorizontal: 15,
  },
  icon: { marginRight: 12 },
  input: { flex: 1, fontSize: 15 },
  signupButton: {
    height: 55,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 10,
  },
  buttonText: { color: "#FFF", fontSize: 14, letterSpacing: 1 },
  footerLink: { marginTop: 30, alignItems: "center" },
  footerText: { fontSize: 12, letterSpacing: 1 },
  securityBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 40,
    opacity: 0.6,
  },
  securityText: { fontSize: 10, letterSpacing: 0.5 },
});
