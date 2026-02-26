import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView, AnimatePresence, MotiText } from "moti";
import {
  BrainCircuit,
  Layers,
  CheckCircle2,
  Zap,
  Radio,
} from "lucide-react-native";
import { saveCourse } from "../../services/courseStorage";

const API_BASE = "https://st-v01.onrender.com";

// --- Sub-component for Typewriter Effect ---
const TypewriterBadge = ({
  isDark,
  accent,
}: {
  isDark: boolean;
  accent: string;
}) => {
  const [text, setText] = useState("");
  const fullText = "SYNCHRONIZING WITH NEURAL CORE...";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) i = 0;
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.statusBadge}>
      <Radio size={10} color={accent} />
      <Text style={[styles.statusText, { color: accent }]}>{text}</Text>
    </View>
  );
};

export default function CreateCourse() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState<any>(null);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const theme = {
    bg: isDark
      ? (["#050A0E", "#0D161F"] as [string, string])
      : (["#F8FAFC", "#F1F5F9"] as [string, string]),
    accent: isDark ? "#00F2FE" : "#2563EB",
    inputBg: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.9)",
    cardBg: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 1)",
    text: isDark ? "#FFFFFF" : "#1E293B",
    secondaryText: isDark ? "#94A3B8" : "#64748B",
    placeholder: isDark ? "#4A5568" : "#94A3B8",
  };

  const generateCourse = async () => {
    if (!topic.trim()) {
      Alert.alert(
        "Neural Link Required",
        "Define an objective to initialize course generation.",
      );
      return;
    }
    setLoading(true);
    setCourse(null); // Clear previous to show generation animation

    try {
      const token = await AsyncStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/content`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ topicName: topic }),
      });
      const data = await res.json();
      if (!data.success) throw new Error();

      const generatedCourse = data.course;
      await saveCourse(generatedCourse);
      setCourse(generatedCourse);
    } catch (err) {
      Alert.alert("Sync Failure", "Neural Core unreachable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <LinearGradient colors={theme.bg} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.centeredWrapper}>
              {/* --- Header Section --- */}
              <View style={styles.header}>
                <View style={styles.orbContainer}>
                  <MotiView
                    animate={{
                      scale: loading ? [1, 1.3, 1] : 1,
                      opacity: loading ? [0.2, 0.5, 0.2] : 0.2,
                    }}
                    transition={{ loop: true, duration: 2000, type: "timing" }}
                    style={[styles.orbPulse, { backgroundColor: theme.accent }]}
                  />
                  <MotiView
                    animate={{ rotate: loading ? "360deg" : "0deg" }}
                    transition={{ loop: true, duration: 2000, type: "timing" }}
                    style={styles.mainOrb}
                  >
                    <LinearGradient
                      colors={[theme.accent, isDark ? "#4FACFE" : "#1E40AF"]}
                      style={StyleSheet.absoluteFill}
                    >
                      <View style={styles.orbInner}>
                        <BrainCircuit size={32} color="white" />
                      </View>
                    </LinearGradient>
                  </MotiView>
                </View>

                <Text style={[styles.title, { color: theme.text }]}>
                  AI Architect
                </Text>

                {loading ? (
                  <TypewriterBadge isDark={isDark} accent={theme.accent} />
                ) : (
                  <View style={styles.statusBadge}>
                    <Zap size={10} color={theme.accent} fill={theme.accent} />
                    <Text style={[styles.statusText, { color: theme.accent }]}>
                      NEURAL CORE READY
                    </Text>
                  </View>
                )}
              </View>

              {/* --- Input Command Card --- */}
              <MotiView
                animate={{ opacity: 1, scale: 1 }}
                from={{ opacity: 0, scale: 0.9 }}
                style={[
                  styles.inputCard,
                  {
                    backgroundColor: theme.inputBg,
                    borderColor: theme.accent + "33",
                  },
                ]}
              >
                <Text
                  style={[styles.inputLabel, { color: theme.secondaryText }]}
                >
                  COMMAND INPUT
                </Text>
                <TextInput
                  placeholder="Subject of Interest..."
                  placeholderTextColor={theme.placeholder}
                  style={[styles.input, { color: theme.text }]}
                  value={topic}
                  onChangeText={setTopic}
                  textAlign="center"
                  editable={!loading}
                />

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={generateCourse}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={[theme.accent, isDark ? "#4FACFE" : "#1E40AF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.generateBtn}
                  >
                    {loading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text style={styles.generateBtnText}>EXECUTE BUILD</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </MotiView>

              {/* --- Syllabus Output --- */}
              <AnimatePresence>
                {course && (
                  <MotiView
                    from={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={styles.previewContainer}
                  >
                    <View style={styles.previewHeader}>
                      <Layers size={14} color={theme.accent} />
                      <Text
                        style={[styles.previewLabel, { color: theme.accent }]}
                      >
                        OUTPUT STREAM
                      </Text>
                    </View>

                    <View style={styles.courseHeader}>
                      <Text style={[styles.courseTitle, { color: theme.text }]}>
                        {course.title}
                      </Text>
                      <Text
                        style={[
                          styles.courseDesc,
                          { color: theme.secondaryText },
                        ]}
                      >
                        {course.description}
                      </Text>
                    </View>

                    {course.chapters.map((chapter: any, index: number) => (
                      <MotiView
                        key={index}
                        from={{ opacity: 0, translateX: -10 }}
                        animate={{ opacity: 1, translateX: 0 }}
                        transition={{ delay: index * 100 }}
                        style={[
                          styles.chapterCard,
                          {
                            backgroundColor: theme.cardBg,
                            borderColor: theme.accent + "15",
                          },
                        ]}
                      >
                        <Text
                          style={[styles.chapterTitle, { color: theme.text }]}
                        >
                          {index + 1}. {chapter.chapterTitle}
                        </Text>
                        {chapter.topics.map((t: any, i: number) => (
                          <View key={i} style={styles.topicRow}>
                            <CheckCircle2 size={12} color={theme.accent} />
                            <Text
                              style={[
                                styles.topicText,
                                { color: theme.secondaryText },
                              ]}
                            >
                              {t.title}
                            </Text>
                          </View>
                        ))}
                      </MotiView>
                    ))}

                    <TouchableOpacity
                      style={styles.finalizeBtn}
                      onPress={() => router.replace(`/course/${course._id}`)}
                    >
                      <Text
                        style={[styles.finalizeText, { color: theme.accent }]}
                      >
                        INITIALIZE FULL SYNC →
                      </Text>
                    </TouchableOpacity>
                  </MotiView>
                )}
              </AnimatePresence>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: "center", paddingVertical: 40 },
  centeredWrapper: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
    paddingHorizontal: 24,
  },

  header: { alignItems: "center", marginBottom: 40 },
  orbContainer: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  mainOrb: { width: 80, height: 80, borderRadius: 40, overflow: "hidden" },
  orbInner: { flex: 1, justifyContent: "center", alignItems: "center" },
  orbPulse: { position: "absolute", width: 100, height: 100, borderRadius: 50 },

  title: {
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    gap: 6,
    marginTop: 8,
    backgroundColor: "rgba(0, 242, 254, 0.05)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: { fontSize: 9, fontWeight: "800", letterSpacing: 1.5 },

  inputCard: { borderRadius: 24, padding: 24, borderWidth: 1 },
  inputLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 8,
    textAlign: "center",
  },
  input: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 25,
    paddingVertical: 8,
  },
  generateBtn: {
    height: 60,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  generateBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 2,
  },

  previewContainer: { marginTop: 40, width: "100%" },
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 15,
  },
  previewLabel: { fontSize: 10, fontWeight: "800", letterSpacing: 1.5 },
  courseHeader: { marginBottom: 24, alignItems: "center" },
  courseTitle: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
  },
  courseDesc: { fontSize: 14, lineHeight: 22, textAlign: "center" },

  chapterCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
  },
  chapterTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  topicRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  topicText: { fontSize: 14, fontWeight: "500" },

  finalizeBtn: { marginTop: 20, alignItems: "center", padding: 20 },
  finalizeText: { fontSize: 12, fontWeight: "900", letterSpacing: 2 },
});
