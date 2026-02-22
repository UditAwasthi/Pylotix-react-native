import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView, MotiText } from "moti";
import { authFetch, API_BASE } from "../services/api";

const { width, height } = Dimensions.get("window");

export default function CreateRoadmap() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Shared Theme Palette
  const theme = {
    bg: isDark ? ["#050A0E", "#0D161F"] : ["#F8FAFC", "#F1F5F9"],
    accent: isDark ? "#00F2FE" : "#2563EB",
    inputBg: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.9)",
    text: isDark ? "#FFFFFF" : "#1E293B",
    placeholder: isDark ? "#4A5568" : "#94A3B8",
  };

  const handleNext = async () => {
    if (!topic) return;
    try {
      setLoading(true);
      const res = await authFetch(`${API_BASE}/roadmap/getQuestions`, {
        method: "POST",
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      setLoading(false);

      router.push({
        pathname: "/roadmaps/questions",
        params: {
          topic,
          questions: JSON.stringify(data.questions),
        },
      });
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient colors={theme.bg} style={StyleSheet.absoluteFill} />

      <View style={styles.centerContent}>
        {/* --- 3D Floating Orb Asset --- */}
        <View style={styles.orbContainer}>
          <MotiView
            from={{ scale: 1, opacity: 0.3 }}
            animate={{ scale: 1.5, opacity: 0.1 }}
            transition={{ loop: true, duration: 3000, type: "timing" }}
            style={[styles.orbPulse, { backgroundColor: theme.accent }]}
          />
          <MotiView
            from={{ translateY: 0 }}
            animate={{ translateY: -15 }}
            transition={{
              loop: true,
              duration: 2000,
              type: "timing",
              reverse: true,
            }}
            style={[styles.mainOrb, { shadowColor: theme.accent }]}
          >
            <LinearGradient
              colors={[theme.accent, isDark ? "#4FACFE" : "#1E40AF"]}
              style={StyleSheet.absoluteFill}
              border-radius={60}
            />
          </MotiView>
        </View>

        {/* --- Text Content --- */}
        <MotiView
          from={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 200 }}
          style={styles.textGroup}
        >
          <Text style={[styles.title, { color: theme.text }]}>Neural Core</Text>
          <Text style={[styles.subtitle, { color: theme.accent }]}>
            DEFINE YOUR OBJECTIVE
          </Text>
        </MotiView>

        {/* --- Input Field --- */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 400 }}
          style={[
            styles.inputWrapper,
            {
              backgroundColor: theme.inputBg,
              borderColor: theme.accent + "33",
            },
          ]}
        >
          <TextInput
            value={topic}
            onChangeText={setTopic}
            placeholder="e.g. Quantum Computing"
            placeholderTextColor={theme.placeholder}
            style={[styles.input, { color: theme.text }]}
          />
        </MotiView>

        {/* --- Action Button --- */}
        <TouchableOpacity
          onPress={handleNext}
          disabled={loading || !topic}
          style={[styles.button, { opacity: topic ? 1 : 0.5 }]}
        >
          <LinearGradient
            colors={[theme.accent, isDark ? "#4FACFE" : "#1E40AF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.btnGradient}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <MotiText
                animate={{ letterSpacing: topic ? 2 : 1 }}
                style={styles.buttonText}
              >
                INITIALIZE SYNC
              </MotiText>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  orbContainer: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  mainOrb: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  orbPulse: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  textGroup: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 4,
    marginTop: 5,
  },
  inputWrapper: {
    width: "100%",
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 20,
    // Soft shadow for light mode
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  input: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  button: {
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 5,
  },
  btnGradient: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "900",
  },
});
