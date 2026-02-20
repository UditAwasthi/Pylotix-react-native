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
} from "react-native";
import { MotiView } from "moti";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const theme = {
    background: isDark ? "#0F172A" : "#FFFFFF",
    inputBg: isDark ? "#1E293B" : "#F1F5F9",
    text: isDark ? "#F8FAFC" : "#1E293B",
    placeholder: isDark ? "#64748B" : "#94A3B8",
    primary: "#4F46E5",
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("https://st-v01.onrender.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ SAVE TOKEN
        await AsyncStorage.setItem("accessToken", data.accessToken);

        router.replace("/(tabs)/home");
      } else {
        Alert.alert("Error", data.message);
      }
    } catch {
      Alert.alert("Network error");
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
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Logo Section */}
          <MotiView
            from={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            style={styles.header}
          >
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.logo}
            />
            <Text style={[styles.title, { color: theme.text }]}>
              Welcome Back
            </Text>
            <Text style={[styles.subtitle, { color: theme.placeholder }]}>
              Sign in to continue your learning journey
            </Text>
          </MotiView>

          {/* Form Section */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 200 }}
            style={styles.form}
          >
            <View
              style={[
                styles.inputContainer,
                { backgroundColor: theme.inputBg },
              ]}
            >
              <Feather
                name="mail"
                size={20}
                color={theme.placeholder}
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Email Address"
                placeholderTextColor={theme.placeholder}
                style={[styles.input, { color: theme.text }]}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View
              style={[
                styles.inputContainer,
                { backgroundColor: theme.inputBg },
              ]}
            >
              <Feather
                name="lock"
                size={20}
                color={theme.placeholder}
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Password"
                placeholderTextColor={theme.placeholder}
                secureTextEntry
                style={[styles.input, { color: theme.text }]}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Verifying..." : "Login"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.replace("/signup")}
              style={styles.signupLink}
            >
              <Text style={[styles.footerText, { color: theme.placeholder }]}>
                New to Pylotix?{" "}
                <Text style={{ color: theme.primary, fontWeight: "700" }}>
                  Sign Up
                </Text>
              </Text>
            </TouchableOpacity>
          </MotiView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 16,
    height: 60,
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
    height: 60,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  signupLink: {
    marginTop: 25,
    alignItems: "center",
  },
  footerText: {
    fontSize: 15,
  },
});
