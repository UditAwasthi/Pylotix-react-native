import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { authFetch } from "../../services/api";

const API_BASE = "https://st-v01.onrender.com";

const { width } = Dimensions.get("window");

export default function NeuralQuestions() {
  const params = useLocalSearchParams();
  const topic = params.topic as string;
  const questions = JSON.parse(params.questions as string);

  const [answers, setAnswers] = useState<any>({});
  const [loading, setLoading] = useState(false);

  // Sync theme with Roadmap
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const theme = {
    bg: isDark ? ["#050A0E", "#0D161F"] : ["#F8FAFC", "#F1F5F9"],
    card: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(255, 255, 255, 0.9)",
    border: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
    textMain: isDark ? "#FFFFFF" : "#1E293B",
    textSub: isDark ? "#A0AEC0" : "#64748B",
    accent: isDark ? "#00F2FE" : "#2563EB",
    line: isDark ? "rgba(0, 242, 254, 0.2)" : "rgba(37, 99, 235, 0.2)",
  };

  const select = (key: string, val: string) => {
    setAnswers({ ...answers, [key]: val });
  };

  const generateRoadmap = async () => {
    if (Object.keys(answers).length !== questions.length) {
      Alert.alert("Input Required", "Please initialize all neural nodes.");
      return;
    }
    try {
      setLoading(true);
      const res = await authFetch(`${API_BASE}/roadmap/getRoadmap`, {
        method: "POST",
        body: JSON.stringify({ topic, duration_months: 3, answers }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success) {
        router.push({
          pathname: "/roadmaps/result",
          params: { roadmap: JSON.stringify(data.roadmap) },
        });
      }
    } catch (err) {
      setLoading(false);
      Alert.alert("Sync Error", "Connection to neural core lost.");
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={theme.bg} style={StyleSheet.absoluteFill} />

      <ScrollView
        contentContainerStyle={styles.scrollPadding}
        showsVerticalScrollIndicator={false}
      >
        <MotiView
          from={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={styles.header}
        >
          <Text style={[styles.title, { color: theme.textMain }]}>{topic}</Text>
          <Text style={[styles.subtitle, { color: theme.accent }]}>
            DATA INITIALIZATION
          </Text>
        </MotiView>

        {questions.map((q: any, index: number) => {
          const isAnswered = !!answers[q.key];
          return (
            <View key={q.key} style={styles.nodeContainer}>
              {/* Connector Line - Pulsing if answered */}
              {index !== questions.length - 1 && (
                <View style={styles.connectorLine}>
                  <LinearGradient
                    colors={[
                      isAnswered ? theme.accent : theme.line,
                      "transparent",
                    ]}
                    style={styles.lineGradient}
                  />
                </View>
              )}

              {/* Node Dot */}
              <MotiView
                animate={{
                  scale: isAnswered ? 1.2 : 1,
                  borderColor: isAnswered ? theme.accent : theme.border,
                }}
                style={[
                  styles.nodeDot,
                  { backgroundColor: isAnswered ? theme.accent : theme.card },
                ]}
              >
                {isAnswered && (
                  <View
                    style={[
                      styles.innerDot,
                      { backgroundColor: isDark ? "#000" : "#FFF" },
                    ]}
                  />
                )}
              </MotiView>

              {/* Question Card */}
              <MotiView
                from={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 100 }}
                style={[
                  styles.glassCard,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
              >
                <Text style={[styles.questionText, { color: theme.textMain }]}>
                  {q.question}
                </Text>

                <View style={styles.optionsWrapper}>
                  {q.options.map((opt: string) => {
                    const selected = answers[q.key] === opt;
                    return (
                      <TouchableOpacity
                        key={opt}
                        onPress={() => select(q.key, opt)}
                        style={[
                          styles.chip,
                          { borderColor: theme.border },
                          selected && {
                            backgroundColor: theme.accent,
                            borderColor: theme.accent,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            { color: theme.textSub },
                            selected && {
                              color: isDark ? "#000" : "#FFF",
                              fontWeight: "bold",
                            },
                          ]}
                        >
                          {opt}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </MotiView>
            </View>
          );
        })}

        <TouchableOpacity
          onPress={generateRoadmap}
          disabled={loading}
          style={styles.launchBtn}
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
              <Text style={styles.btnText}>GENERATE NEURAL PATH</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollPadding: { padding: 24, paddingTop: 60, paddingBottom: 100 },
  header: { marginBottom: 40 },
  title: { fontSize: 32, fontWeight: "900", letterSpacing: -1 },
  subtitle: { fontSize: 12, fontWeight: "700", letterSpacing: 3, marginTop: 4 },
  nodeContainer: { flexDirection: "row", marginBottom: 30, minHeight: 120 },
  connectorLine: {
    position: "absolute",
    left: 7,
    top: 24,
    bottom: -40,
    width: 2,
  },
  lineGradient: { flex: 1, width: "100%" },
  nodeDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
    zIndex: 10,
    borderWidth: 2,
  },
  innerDot: { width: 4, height: 4, borderRadius: 2 },
  glassCard: {
    flex: 1,
    marginLeft: 20,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    lineHeight: 24,
  },
  optionsWrapper: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: "rgba(150,150,150,0.05)",
  },
  chipText: { fontSize: 13, fontWeight: "500" },
  launchBtn: { marginTop: 20, borderRadius: 16, overflow: "hidden" },
  btnGradient: { paddingVertical: 18, alignItems: "center" },
  btnText: { color: "#FFF", fontWeight: "900", letterSpacing: 1.5 },
});
