import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
  useColorScheme,
  Platform,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MotiView } from "moti";
import {
  Play,
  Lock,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Terminal,
  Activity,
} from "lucide-react-native";
import { saveCourse, getProgress } from "../../services/courseStorage";

const API = "https://st-v01.onrender.com";
const MONO = Platform.OS === "ios" ? "Menlo" : "monospace";

export default function CourseDetail() {
  const params = useLocalSearchParams();
  const courseId = params.courseId as string;
  const isDark = useColorScheme() === "dark";

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({ chapterIndex: 0, topicIndex: 0 });

  const theme = {
    bg: isDark ? "#020205" : "#F8FAFC",
    card: isDark ? "rgba(255,255,255,0.03)" : "#FFFFFF",
    text: isDark ? "#FFFFFF" : "#1E293B",
    muted: isDark ? "rgba(255,255,255,0.4)" : "#64748B",
    accent: "#00F2FE",
    border: isDark ? "rgba(255,255,255,0.1)" : "#E2E8F0",
  };

  useEffect(() => {
    if (courseId) load();
  }, [courseId]);

  async function load() {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const res = await fetch(`${API}/content/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
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

  if (loading || !course) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  const isLocked = (cIdx: number, tIdx: number) => {
    if (cIdx < progress.chapterIndex) return false;
    if (cIdx === progress.chapterIndex && tIdx <= progress.topicIndex)
      return false;
    return true;
  };

  const isCompleted = (cIdx: number, tIdx: number) => {
    if (cIdx < progress.chapterIndex) return true;
    if (cIdx === progress.chapterIndex && tIdx < progress.topicIndex)
      return true;
    return false;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER: MISSION INTEL */}
        <MotiView
          from={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={styles.header}
        >
          <Text style={[styles.label, { color: theme.accent }]}>
            // SYSTEM_MANIFEST_v1.0
          </Text>
          <Text style={[styles.courseTitle, { color: theme.text }]}>
            {course.title.toUpperCase()}
          </Text>

          <View style={styles.statsRow}>
            <View style={[styles.badge, { backgroundColor: theme.glass }]}>
              <Terminal size={12} color={theme.accent} />
              <Text style={[styles.badgeText, { color: theme.muted }]}>
                {course.chapters?.length} NODES
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: theme.glass }]}>
              <Activity size={12} color={theme.accent} />
              <Text style={[styles.badgeText, { color: theme.muted }]}>
                STABLE_LINK
              </Text>
            </View>
          </View>
        </MotiView>

        {/* RESUME TRIGGER */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.resumeButton, { backgroundColor: theme.accent }]}
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
          <Play size={18} color="#000" fill="#000" />
          <Text style={styles.resumeText}>INITIATE_NEURAL_LINK</Text>
        </TouchableOpacity>

        {/* CHAPTER NODES */}
        {course.chapters?.map((ch: any, cIdx: number) => (
          <View key={cIdx} style={styles.chapterWrapper}>
            <View style={styles.chapterHeader}>
              <View
                style={[
                  styles.chapterDot,
                  {
                    backgroundColor:
                      cIdx <= progress.chapterIndex
                        ? theme.accent
                        : theme.muted,
                  },
                ]}
              />
              <Text style={[styles.chapterTitle, { color: theme.muted }]}>
                NODE_0{cIdx + 1}: {ch.chapterTitle.toUpperCase()}
              </Text>
            </View>

            {ch.topics?.map((t: any, tIdx: number) => {
              const locked = isLocked(cIdx, tIdx);
              const completed = isCompleted(cIdx, tIdx);

              return (
                <MotiView
                  key={tIdx}
                  from={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: tIdx * 100 }}
                >
                  <TouchableOpacity
                    disabled={locked}
                    style={[
                      styles.topicCard,
                      {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                      },
                      locked && styles.topicCardLocked,
                    ]}
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
                      {locked ? (
                        <Lock size={16} color={theme.muted} />
                      ) : completed ? (
                        <CheckCircle2 size={16} color="#00FF94" />
                      ) : (
                        <Play size={16} color={theme.accent} />
                      )}
                      <Text
                        style={[
                          styles.topicTitle,
                          { color: locked ? theme.muted : theme.text },
                        ]}
                      >
                        {t.title}
                      </Text>
                    </View>

                    {!locked && <ChevronRight size={16} color={theme.accent} />}
                  </TouchableOpacity>
                </MotiView>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { padding: 25, paddingBottom: 100 },

  header: { marginBottom: 32 },
  label: { fontFamily: MONO, fontSize: 10, letterSpacing: 2, marginBottom: 8 },
  courseTitle: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.5,
    lineHeight: 34,
  },

  statsRow: { flexDirection: "row", gap: 10, marginTop: 15 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  badgeText: {
    marginLeft: 6,
    fontFamily: MONO,
    fontSize: 9,
    fontWeight: "700",
  },

  resumeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    borderRadius: 2,
    marginBottom: 40,
    gap: 12,
    shadowColor: "#00F2FE",
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  resumeText: {
    color: "black",
    fontWeight: "900",
    letterSpacing: 2,
    fontSize: 12,
  },

  chapterWrapper: { marginBottom: 30 },
  chapterHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 10,
  },
  chapterDot: { width: 6, height: 6, borderRadius: 3 },
  chapterTitle: {
    fontFamily: MONO,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },

  topicCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderRadius: 2,
    borderWidth: 1,
    marginBottom: 8,
  },
  topicCardLocked: { opacity: 0.4 },
  topicInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
  topicTitle: {
    marginLeft: 15,
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
