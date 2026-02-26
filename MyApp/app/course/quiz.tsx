import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
  useColorScheme,
  Platform,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { MotiView, AnimatePresence } from "moti";
import { Easing } from "react-native-reanimated";
import {
  ChevronRight,
  HelpCircle,
  CheckCircle2,
  ShieldCheck,
  Zap,
  AlertTriangle,
} from "lucide-react-native";

import {
  getCourse,
  saveProgress,
  saveCertificate,
} from "../../services/courseStorage";
import {
  syncQuiz,
  syncComplete,
  syncProgress,
} from "../../services/syncService";

const MONO = Platform.OS === "ios" ? "Menlo" : "monospace";

export default function Quiz() {
  const params = useLocalSearchParams();
  const isDark = useColorScheme() === "dark";

  const courseId = Array.isArray(params.courseId)
    ? params.courseId[0]
    : params.courseId;
  const chapterIndex = Number(
    Array.isArray(params.chapterIndex)
      ? params.chapterIndex[0]
      : (params.chapterIndex ?? 0),
  );
  const topicIndex = Number(
    Array.isArray(params.topicIndex)
      ? params.topicIndex[0]
      : (params.topicIndex ?? 0),
  );

  const [questions, setQuestions] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const theme = {
    bg: isDark ? "#020205" : "#F8FAFC",
    accent: "#00F2FE",
    card: isDark ? "rgba(255,255,255,0.03)" : "#FFFFFF",
    text: isDark ? "#FFFFFF" : "#1A1A1A",
    muted: isDark ? "rgba(255, 255, 255, 0.4)" : "#64748B",
    border: isDark ? "rgba(0, 242, 254, 0.3)" : "#E2E8F0",
  };

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const course = await getCourse(courseId as string);
      if (!course || !course.chapters?.[chapterIndex]?.topics?.[topicIndex]) {
        setLoading(false);
        return;
      }
      setQuestions(
        course.chapters[chapterIndex].topics[topicIndex].quiz.questions,
      );
    } catch (e) {
      console.log("Quiz Load Error", e);
    } finally {
      setLoading(false);
    }
  }

  function next() {
    let newCorrect = correct;
    if (selected === questions[index].correctOptionIndex) {
      newCorrect++;
    }
    setCorrect(newCorrect);

    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setSelected(null);
    } else {
      finish(newCorrect);
    }
  }

  async function finish(finalCorrect: number) {
    const passed = finalCorrect / questions.length >= 0.7;
    const course = await getCourse(courseId as string);

    let nextChapter = chapterIndex;
    let nextTopic = topicIndex + 1;

    if (!course.chapters[chapterIndex].topics[nextTopic]) {
      nextChapter++;
      nextTopic = 0;
    }

    await saveProgress(courseId, {
      chapterIndex: nextChapter,
      topicIndex: nextTopic,
    });
    syncQuiz(
      courseId,
      chapterIndex,
      topicIndex,
      finalCorrect,
      questions.length,
      passed,
    );
    syncProgress(courseId, nextChapter, nextTopic);

    if (!passed) {
      router.replace({
        pathname: "/course/learn",
        params: { courseId, chapterIndex, topicIndex },
      });
      return;
    }

    if (!course.chapters[nextChapter]) {
      await saveCertificate(courseId);
      syncComplete(courseId);
      router.replace("/course/certificate");
      return;
    }

    router.replace({
      pathname: "/course/learn",
      params: { courseId, chapterIndex: nextChapter, topicIndex: nextTopic },
    });
  }

  if (loading)
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );

  const q = questions[index];
  const progressPercent = ((index + 1) / questions.length) * 100;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle="light-content" />

      {/* HUD: VALIDATION HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.mono, { color: theme.accent, fontSize: 10 }]}>
              // PROTOCOL_v4.2
            </Text>
            <Text style={[styles.navTitle, { color: theme.text }]}>
              INTEGRITY_SCAN
            </Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={[styles.mono, { color: theme.text, fontSize: 12 }]}>
              {index + 1}/{questions.length}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.progressBarBg,
            { backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#E5E7EB" },
          ]}
        >
          <MotiView
            animate={{ width: `${progressPercent}%` }}
            transition={{
              type: "timing",
              duration: 500,
              easing: Easing.out(Easing.quad),
            }}
            style={[styles.progressBarFill, { backgroundColor: theme.accent }]}
          />
        </View>
      </View>

      {/* QUESTION MODULE */}
      <View style={styles.content}>
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          key={index} // Re-animate on question change
          style={[
            styles.questionCard,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <View style={styles.qIcon}>
            <ShieldCheck size={20} color={theme.accent} />
          </View>
          <Text style={[styles.questionText, { color: theme.text }]}>
            {q.question}
          </Text>
        </MotiView>

        <View style={styles.optionsList}>
          {q.options.map((option: string, i: number) => {
            const isSelected = selected === i;
            return (
              <TouchableOpacity
                key={i}
                activeOpacity={0.8}
                onPress={() => setSelected(i)}
                style={[
                  styles.optionContainer,
                  {
                    backgroundColor: theme.card,
                    borderColor: isSelected ? theme.accent : theme.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.optionIndex,
                    {
                      backgroundColor: isSelected
                        ? theme.accent
                        : "rgba(255,255,255,0.05)",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.mono,
                      {
                        color: isSelected ? "#000" : theme.muted,
                        fontSize: 10,
                      },
                    ]}
                  >
                    0{i + 1}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.optionText,
                    { color: isSelected ? theme.accent : theme.text },
                  ]}
                >
                  {option}
                </Text>
                {isSelected && (
                  <MotiView from={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Zap size={16} color={theme.accent} fill={theme.accent} />
                  </MotiView>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* FOOTER: COMMANDS */}
      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={selected === null}
          onPress={next}
          style={[
            styles.button,
            {
              backgroundColor:
                selected === null ? "rgba(255,255,255,0.05)" : theme.accent,
            },
            selected === null && { borderColor: "transparent" },
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              { color: selected === null ? theme.muted : "#000" },
            ]}
          >
            {index + 1 === questions.length ? "FINALIZE_UPLINK" : "NEXT_ENTRY"}
          </Text>
          <ChevronRight
            size={20}
            color={selected === null ? theme.muted : "#000"}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  mono: { fontFamily: MONO, letterSpacing: 1, fontWeight: "800" },

  // Header
  header: { padding: 30, paddingTop: 20 },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  navTitle: { fontSize: 20, fontWeight: "200", letterSpacing: 5 },
  countBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  progressBarBg: { height: 2, borderRadius: 1, overflow: "hidden" },
  progressBarFill: { height: "100%" },

  // Question Card
  content: { flex: 1, paddingHorizontal: 25 },
  questionCard: {
    padding: 25,
    borderRadius: 2,
    borderWidth: 1,
    marginBottom: 30,
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  qIcon: { marginBottom: 15 },
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 28,
    letterSpacing: 0.5,
  },

  // Options
  optionsList: { gap: 10 },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 2,
    borderWidth: 1,
  },
  optionIndex: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    borderRadius: 2,
  },
  optionText: { fontSize: 14, fontWeight: "600", flex: 1 },

  // Footer
  footer: { padding: 30, borderTopWidth: 1 },
  button: {
    paddingVertical: 18,
    borderRadius: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#00F2FE",
  },
  buttonText: { fontSize: 12, fontWeight: "900", letterSpacing: 2 },
});
