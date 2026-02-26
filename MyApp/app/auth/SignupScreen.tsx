import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  useColorScheme,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import { MotiView, MotiText } from "moti";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MONO = Platform.OS === "ios" ? "Menlo" : "monospace";

export default function SignupScreen() {
  const isDark = useColorScheme() === "dark";

  const theme = {
    background: "#020205", // Deep black
    inputBg: "rgba(255, 255, 255, 0.03)",
    text: "#FFFFFF",
    accent: "#00F2FE", // Cyan Neon
    muted: "rgba(255, 255, 255, 0.4)",
    border: "rgba(0, 242, 254, 0.2)",
  };

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const aiApiKey = null;

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
    } catch {
      Alert.alert("NETWORK_ERROR", "Neural stream disconnected.");
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
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* TOP HUD BRANDING */}
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={styles.header}
          >
            <View style={[styles.logoFrame, { borderColor: theme.border }]}>
              <Image
                source={require("../../assets/images/logo.png")}
                style={styles.logo}
              />
            </View>
            <MotiText
              from={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 200 }}
              style={[styles.mono, styles.title, { color: theme.text }]}
            >
              CREATE_IDENTITY
            </MotiText>
            <Text style={[styles.subtitle, { color: theme.muted }]}>
              Register your neural signature for encrypted stream access.
            </Text>
          </MotiView>

          {/* REGISTRATION FORM */}
          <MotiView
            from={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 400 }}
            style={styles.form}
          >
            <InputGroup
              label="USER_NAME"
              icon="user"
              placeholder="ENTER_FULL_NAME"
              theme={theme}
              onChangeText={setName}
            />
            <InputGroup
              label="COMM_CHANNEL"
              icon="mail"
              placeholder="USER@NEURAL_LINK"
              theme={theme}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <InputGroup
              label="ACCESS_KEY"
              icon="lock"
              placeholder="ENCRYPT_PASSWORD"
              theme={theme}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.button, { backgroundColor: theme.accent }]}
              onPress={handleSignup}
              disabled={loading}
            >
              <Text style={[styles.mono, styles.buttonText]}>
                {loading ? "REGISTERING..." : "INITIALIZE_IDENTITY"}
              </Text>
              <MaterialCommunityIcons
                name="shield-plus-outline"
                size={18}
                color="black"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.replace("/login")}
              style={styles.footerLink}
            >
              <Text style={[styles.mono, { color: theme.muted, fontSize: 11 }]}>
                ALREADY_REGISTERED?{" "}
                <Text style={{ color: theme.accent }}>RESUME_UPLINK</Text>
              </Text>
            </TouchableOpacity>
          </MotiView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Re-styled Terminal Input Group
const InputGroup = ({ label, icon, theme, ...props }: any) => (
  <View
    style={[
      styles.inputWrapper,
      { borderColor: theme.border, backgroundColor: theme.inputBg },
    ]}
  >
    <View style={styles.inputLabelContainer}>
      <Text style={[styles.mono, { color: theme.accent, fontSize: 8 }]}>
        {label}
      </Text>
    </View>
    <View style={styles.inputRow}>
      <Feather
        name={icon}
        size={16}
        color={theme.accent}
        style={styles.inputIcon}
      />
      <TextInput
        placeholderTextColor={theme.muted}
        style={[styles.input, { color: theme.text, fontFamily: MONO }]}
        {...props}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  mono: { fontFamily: MONO, letterSpacing: 2, fontWeight: "700" },
  scrollContent: { flexGrow: 1, justifyContent: "center", padding: 30 },
  header: { alignItems: "center", marginBottom: 40 },
  logoFrame: {
    width: 80,
    height: 80,
    borderWidth: 1,
    padding: 12,
    marginBottom: 20,
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  logo: { width: "100%", height: "100%", resizeMode: "contain" },
  title: { fontSize: 22, fontWeight: "200", letterSpacing: 6 },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 18,
    fontFamily: MONO,
    opacity: 0.7,
  },
  form: { width: "100%" },

  // Terminal Input Styling
  inputWrapper: {
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
    position: "relative",
  },
  inputLabelContainer: {
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
  footerLink: { marginTop: 30, alignItems: "center" },
});
