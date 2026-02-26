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
} from "react-native";
import { MotiView, MotiText } from "moti";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignupScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const theme = {
    background: isDark ? "#0F172A" : "#FFFFFF",
    card: isDark ? "#1E293B" : "#F1F5F9",
    text: isDark ? "#F8FAFC" : "#1E293B",
    primary: "#4F46E5",
    placeholder: isDark ? "#64748B" : "#94A3B8",
  };

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const aiApiKey = null;
  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill all fields");
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
        Alert.alert("Success", "Account created successfully!");
        await AsyncStorage.setItem("accessToken", data.accessToken);

        router.replace("/(tabs)/home");
      } else {
        Alert.alert("Error", data.message || "Signup failed");
      }
    } catch {
      Alert.alert("Error", "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Top Branding */}
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={styles.header}
          >
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.logo}
            />
            <MotiText
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 200 }}
              style={[styles.title, { color: theme.text }]}
            >
              Join Pylotix
            </MotiText>
            <Text style={[styles.subtitle, { color: theme.placeholder }]}>
              Start your personalized learning experience today.
            </Text>
          </MotiView>

          {/* Input Fields */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 400 }}
            style={styles.form}
          >
            <InputGroup
              icon="user"
              placeholder="Full Name"
              theme={theme}
              onChangeText={setName}
            />
            <InputGroup
              icon="mail"
              placeholder="Email Address"
              theme={theme}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <InputGroup
              icon="lock"
              placeholder="Create Password"
              theme={theme}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={handleSignup}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Initializing..." : "Create Account"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.replace("/login")}
              style={styles.footerLink}
            >
              <Text style={[styles.footerText, { color: theme.placeholder }]}>
                Already a member?{" "}
                <Text style={{ color: theme.primary, fontWeight: "700" }}>
                  Login
                </Text>
              </Text>
            </TouchableOpacity>
          </MotiView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Helper component for styled inputs
const InputGroup = ({ icon, theme, ...props }: any) => (
  <View style={[styles.inputContainer, { backgroundColor: theme.card }]}>
    <Feather
      name={icon}
      size={20}
      color={theme.placeholder}
      style={styles.inputIcon}
    />
    <TextInput
      placeholderTextColor={theme.placeholder}
      style={[styles.input, { color: theme.text }]}
      {...props}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: "contain",
    marginBottom: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderRadius: 18,
    marginBottom: 16,
    height: 64,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  button: {
    height: 64,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  footerLink: {
    marginTop: 25,
    alignItems: "center",
  },
  footerText: {
    fontSize: 15,
  },
});
