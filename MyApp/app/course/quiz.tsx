import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
} from "react-native";

import { useLocalSearchParams, router } from "expo-router";
import { ChevronRight, HelpCircle, CheckCircle2 } from "lucide-react-native";

import { getCourse, saveProgress, saveCertificate } from "../../services/courseStorage";
import { syncQuiz, syncComplete, syncProgress } from "../../services/syncService";

export default function Quiz() {
  const params = useLocalSearchParams();
  const courseId = Array.isArray(params.courseId) ? params.courseId[0] : params.courseId;
  const chapterIndex = Number(Array.isArray(params.chapterIndex) ? params.chapterIndex[0] : (params.chapterIndex ?? 0));
  const topicIndex = Number(Array.isArray(params.topicIndex) ? params.topicIndex[0] : (params.topicIndex ?? 0));

  const [questions, setQuestions] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

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
      setQuestions(course.chapters[chapterIndex].topics[topicIndex].quiz.questions);
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

    await saveProgress(courseId, { chapterIndex: nextChapter, topicIndex: nextTopic });
    syncQuiz(courseId, chapterIndex, topicIndex, finalCorrect, questions.length, passed);
    syncProgress(courseId, nextChapter, nextTopic);

    if (!passed) {
      // Potentially show a "Try Again" modal here
      router.replace({ pathname: "/course/learn", params: { courseId, chapterIndex, topicIndex } });
      return;
    }

    if (!course.chapters[nextChapter]) {
      await saveCertificate(courseId);
      syncComplete(courseId);
      router.replace("/course/certificate");
      return;
    }

    router.replace({ pathname: "/course/learn", params: { courseId, chapterIndex: nextChapter, topicIndex: nextTopic } });
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!questions.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No Quiz Available</Text>
      </View>
    );
  }

  const q = questions[index];
  const progressPercent = ((index + 1) / questions.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER & PROGRESS */}
      <View style={styles.header}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>QUIZ PROGRESS</Text>
          <Text style={styles.progressCount}>{index + 1} of {questions.length}</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>
      </View>

      {/* QUESTION CONTENT */}
      <View style={styles.content}>
        <View style={styles.questionCard}>
          <HelpCircle size={28} color="#2563EB" />
          <Text style={styles.questionText}>{q.question}</Text>
        </View>

        <View style={styles.optionsList}>
          {q.options.map((option: string, i: number) => {
            const isSelected = selected === i;
            return (
              <TouchableOpacity
                key={i}
                activeOpacity={0.7}
                onPress={() => setSelected(i)}
                style={[styles.optionContainer, isSelected && styles.selectedOption]}
              >
                <Text style={[styles.optionText, isSelected && styles.selectedOptionText]}>
                  {option}
                </Text>
                {isSelected && <CheckCircle2 size={20} color="#FFFFFF" />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={selected === null}
          onPress={next}
          style={[styles.button, selected === null && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>
            {index + 1 === questions.length ? "Submit Quiz" : "Continue"}
          </Text>
          <ChevronRight size={20} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  
  // Header & Progress
  header: { padding: 24, paddingTop: 12 },
  progressHeader: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "flex-end",
    marginBottom: 8 
  },
  progressLabel: { fontSize: 12, fontWeight: "800", color: "#9CA3AF", letterSpacing: 1 },
  progressCount: { fontSize: 14, fontWeight: "700", color: "#111827" },
  progressBarBg: { height: 6, backgroundColor: "#F3F4F6", borderRadius: 3, overflow: "hidden" },
  progressBarFill: { height: "100%", backgroundColor: "#2563EB", borderRadius: 3 },

  // Content
  content: { flex: 1, paddingHorizontal: 24 },
  questionCard: { marginBottom: 32 },
  questionText: { 
    fontSize: 24, 
    fontWeight: "700", 
    color: "#111827", 
    lineHeight: 32,
    marginTop: 16 
  },
  
  // Options
  optionsList: { gap: 12 },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#F3F4F6",
  },
  selectedOption: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
    // Shadow for selected item
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  optionText: { fontSize: 16, color: "#374151", fontWeight: "600", flex: 1 },
  selectedOptionText: { color: "#FFFFFF" },

  // Footer
  footer: { padding: 24, borderTopWidth: 1, borderTopColor: "#F3F4F6" },
  button: {
    backgroundColor: "#111827", // Darker for high contrast
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonDisabled: { backgroundColor: "#E5E7EB" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "700" },
  
  emptyText: { color: "#9CA3AF", fontSize: 16, fontWeight: "500" },
});