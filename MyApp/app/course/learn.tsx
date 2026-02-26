import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
} from "react-native";

import { useLocalSearchParams, router } from "expo-router";
import { ArrowLeft, BookOpen, GraduationCap, Code2 } from "lucide-react-native";

import { getCourse, saveProgress } from "../../services/courseStorage";
import { syncProgress } from "../../services/syncService";

export default function Learn() {
  const params = useLocalSearchParams();
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

  const [topic, setTopic] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;
    load();
  }, [courseId]);

  async function load() {
    try {
      const course = await getCourse(courseId as string);
      if (!course || !course.chapters?.[chapterIndex]?.topics?.[topicIndex]) {
        setLoading(false);
        return;
      }
      const currentTopic = course.chapters[chapterIndex].topics[topicIndex];
      setTopic(currentTopic);

      await saveProgress(courseId, { chapterIndex, topicIndex });
      syncProgress(courseId, chapterIndex, topicIndex);
    } catch (e) {
      console.log("Learn Load Error:", e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!topic) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Topic not found</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <ArrowLeft size={22} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.navInfo}>
          <Text style={styles.navSubtitle}>CHAPTER {chapterIndex + 1}</Text>
          <Text style={styles.navTitle}>Lesson {topicIndex + 1}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* TOPIC HEADER */}
        <View style={styles.headerSection}>
          <View style={styles.badge}>
            <BookOpen size={14} color="#2563EB" />
            <Text style={styles.badgeText}>Learning Material</Text>
          </View>
          <Text style={styles.title}>{topic.title}</Text>
          <Text style={styles.desc}>{topic.content.description}</Text>
        </View>

        {/* CONTENT SECTIONS */}
        {topic.content.sections.map((s: any, i: number) => {
          if (s.type === "text") {
            return (
              <Text key={i} style={styles.text}>
                {s.value}
              </Text>
            );
          }

          if (s.type === "code_example") {
            return (
              <View key={i} style={styles.codeContainer}>
                <View style={styles.codeHeader}>
                  <Code2 size={16} color="#9CA3AF" />
                  <Text style={styles.codeHeaderTitle}>Example Code</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <Text style={styles.codeText}>{s.code}</Text>
                </ScrollView>
              </View>
            );
          }
          return null;
        })}

        {/* FOOTER ACTION */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.quizBtn}
          onPress={() =>
            router.push({
              pathname: "/course/quiz",
              params: { courseId, chapterIndex, topicIndex },
            })
          }
        >
          <GraduationCap size={20} color="white" />
          <Text style={styles.quizBtnText}>Test Your Knowledge</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  // Navigation
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  iconBtn: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
  },
  navInfo: { alignItems: "center" },
  navSubtitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#9CA3AF",
    letterSpacing: 1,
  },
  navTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },

  // Content
  scrollContent: { padding: 24 },
  headerSection: { marginBottom: 24 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
    gap: 6,
  },
  badgeText: { fontSize: 12, fontWeight: "600", color: "#2563EB" },
  title: { fontSize: 30, fontWeight: "800", color: "#111827", lineHeight: 36 },
  desc: {
    marginTop: 12,
    fontSize: 17,
    color: "#4B5563",
    lineHeight: 26,
    fontWeight: "500",
  },

  text: {
    marginTop: 20,
    fontSize: 16,
    lineHeight: 26,
    color: "#374151",
  },

  // Code Block
  codeContainer: {
    backgroundColor: "#1F2937",
    borderRadius: 12,
    marginTop: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#374151",
  },
  codeHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
    backgroundColor: "#111827",
    gap: 8,
  },
  codeHeaderTitle: { color: "#9CA3AF", fontSize: 12, fontWeight: "600" },
  codeText: {
    padding: 16,
    color: "#F3F4F6",
    fontFamily: "monospace", // or a specific loaded font like 'Courier'
    fontSize: 14,
    lineHeight: 20,
  },

  // Button
  quizBtn: {
    flexDirection: "row",
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    gap: 10,
    // Shadow
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  quizBtnText: { color: "white", fontSize: 16, fontWeight: "700" },

  // Error/Loading
  errorText: { fontSize: 16, color: "#6B7280", marginBottom: 16 },
  backBtn: { padding: 12, backgroundColor: "#F3F4F6", borderRadius: 8 },
  backBtnText: { fontWeight: "600", color: "#111827" },
});
