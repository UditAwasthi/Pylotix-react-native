import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";

import { useLocalSearchParams, router } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  Play,
  Lock,
  CheckCircle2,
  ChevronRight,
  BookOpen,
} from "lucide-react-native";

import { saveCourse, getProgress } from "../../services/courseStorage";

const API = "https://st-v01.onrender.com";

export default function CourseDetail() {
  const params = useLocalSearchParams();

  const courseId = params.courseId as string;

  const [course, setCourse] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  const [progress, setProgress] = useState({
    chapterIndex: 0,
    topicIndex: 0,
  });

  useEffect(() => {
    if (!courseId) return;

    load();
  }, [courseId]);

  async function load() {
    try {
      const token = await AsyncStorage.getItem("accessToken");

      const res = await fetch(`${API}/content/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!data) return;

      setCourse(data);

      await saveCourse(data);

      const prog = await getProgress(courseId);

      if (prog) {
        setProgress({
          chapterIndex: Number(prog.chapterIndex) || 0,
          topicIndex: Number(prog.topicIndex) || 0,
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- LOADING ---------------- */

  if (loading || !course) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  /* ---------------- LOCK LOGIC ---------------- */

  function isLocked(cIdx: number, tIdx: number) {
    if (!progress) return true;

    if (cIdx < progress.chapterIndex) return false;

    if (cIdx === progress.chapterIndex && tIdx <= progress.topicIndex)
      return false;

    return true;
  }

  function isCompleted(cIdx: number, tIdx: number) {
    if (!progress) return false;

    if (cIdx < progress.chapterIndex) return true;

    if (cIdx === progress.chapterIndex && tIdx < progress.topicIndex)
      return true;

    return false;
  }

  /* ---------------- UI ---------------- */

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* HEADER */}

        <View style={styles.header}>
          <Text style={styles.courseTitle}>{course.title}</Text>

          <View style={styles.badge}>
            <BookOpen size={14} color="#6366f1" />

            <Text style={styles.badgeText}>
              {course.chapters?.length} Chapters
            </Text>
          </View>
        </View>

        {/* RESUME */}

        <TouchableOpacity
          style={styles.resumeButton}
          onPress={() =>
            router.push({
              pathname: "/course/learn",

              params: {
                courseId,

                chapterIndex: progress.chapterIndex,

                topicIndex: progress.topicIndex,
              },
            })
          }
        >
          <Play size={20} color="#fff" fill="#fff" />

          <Text style={styles.resumeText}>Continue Learning</Text>
        </TouchableOpacity>

        {/* CHAPTERS */}

        {course.chapters?.map((ch: any, cIdx: number) => (
          <View key={cIdx} style={styles.chapterWrapper}>
            <Text style={styles.chapterTitle}>
              Chapter {cIdx + 1}: {ch.chapterTitle}
            </Text>

            {ch.topics?.map((t: any, tIdx: number) => {
              const locked = isLocked(cIdx, tIdx);

              const completed = isCompleted(cIdx, tIdx);

              return (
                <TouchableOpacity
                  key={tIdx}
                  disabled={locked}
                  style={[styles.topicCard, locked && styles.topicCardLocked]}
                  onPress={() =>
                    router.push({
                      pathname: "/course/learn",

                      params: {
                        courseId,

                        chapterIndex: cIdx,

                        topicIndex: tIdx,
                      },
                    })
                  }
                >
                  <View style={styles.topicInfo}>
                    {locked && <Lock size={18} color="#94a3b8" />}

                    {completed && <CheckCircle2 size={18} color="#22c55e" />}

                    {!locked && !completed && (
                      <Play size={18} color="#6366f1" />
                    )}

                    <Text style={styles.topicTitle}>{t.title}</Text>
                  </View>

                  {!locked && <ChevronRight size={18} color="#cbd5e1" />}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  scrollContent: {
    padding: 20,
  },

  header: {
    marginBottom: 24,
  },

  courseTitle: {
    fontSize: 28,
    fontWeight: "800",
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  badgeText: {
    marginLeft: 6,
  },

  resumeButton: {
    backgroundColor: "#6366f1",
    padding: 16,
    borderRadius: 12,
    marginBottom: 30,
  },

  resumeText: {
    color: "white",
    fontWeight: "bold",
  },

  chapterWrapper: {
    marginBottom: 20,
  },

  chapterTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },

  topicCard: {
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 10,
  },

  topicCardLocked: {
    opacity: 0.5,
  },

  topicInfo: {
    flexDirection: "row",
    alignItems: "center",
  },

  topicTitle: {
    marginLeft: 10,
  },
});
