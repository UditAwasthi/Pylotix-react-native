import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  useColorScheme,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView, AnimatePresence } from "moti";
import {
  BookOpen,
  Plus,
  LayoutGrid,
  Compass,
  Zap,
  ArrowUpRight,
} from "lucide-react-native";

const API = "https://st-v01.onrender.com";
const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const [courses, setCourses] = useState<any[]>([]);
  const [progressMap, setProgressMap] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const theme = {
    bg: isDark
      ? (["#050A0E", "#0D161F"] as [string, string])
      : (["#F8FAFC", "#F1F5F9"] as [string, string]),
    accent: isDark ? "#00F2FE" : "#2563EB",
    cardBg: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(255, 255, 255, 1)",
    text: isDark ? "#FFFFFF" : "#1E293B",
    secondaryText: isDark ? "#94A3B8" : "#64748B",
  };

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) return;

      const res = await fetch(`${API}/content/getAllCourses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ existingCourseIds: [] }),
      });

      const data = await res.json();
      if (!Array.isArray(data)) {
        setCourses([]);
        return;
      }
      setCourses(data);
      loadProgress(data);
    } catch (e) {
      console.log("Course load error", e);
    } finally {
      setLoading(false);
    }
  }

  async function loadProgress(courseList: any[]) {
    const token = await AsyncStorage.getItem("accessToken");
    let map: any = {};
    for (let course of courseList) {
      try {
        const res = await fetch(`${API}/progress/${course._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const prog = data.progress || { chapterIndex: 0, topicIndex: 0 };
        const totalTopics =
          course.chapters?.reduce(
            (acc: number, ch: any) => acc + (ch.topics?.length || 0),
            0,
          ) || 1;
        const completedTopics = prog.chapterIndex * 10 + prog.topicIndex;
        map[course._id] = Math.min(
          100,
          Math.floor((completedTopics / totalTopics) * 100),
        );
      } catch {}
    }
    setProgressMap(map);
  }

  if (loading)
    return (
      <View style={[styles.center, { backgroundColor: theme.bg[0] }]}>
        <MotiView
          from={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ loop: true, type: "timing", duration: 1500 }}
        >
          <Zap size={40} color={theme.accent} />
        </MotiView>
      </View>
    );

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <LinearGradient colors={theme.bg} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* TOP NAV */}
          <View style={styles.headerNav}>
            <View>
              <Text style={[styles.greeting, { color: theme.secondaryText }]}>
                TERMINAL ACTIVE
              </Text>
              <Text style={[styles.userName, { color: theme.text }]}>
                Neural Dashboard
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: theme.cardBg }]}
            >
              <Compass size={20} color={theme.text} />
            </TouchableOpacity>
          </View>

          {/* QUICK STATS / ACTION */}
          <MotiView
            from={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={[styles.heroCard, { borderColor: theme.accent + "33" }]}
          >
            <LinearGradient
              colors={[theme.accent + "22", "transparent"]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <View style={styles.heroContent}>
              <View>
                <Text style={[styles.heroTitle, { color: theme.text }]}>
                  Ready to Expand?
                </Text>
                <Text style={[styles.heroSub, { color: theme.secondaryText }]}>
                  Initialize a new neural pathway.
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.fab, { backgroundColor: theme.accent }]}
                onPress={() => router.push("/(tabs)/createCourse")}
              >
                <Plus size={24} color="white" />
              </TouchableOpacity>
            </View>
          </MotiView>

          {/* COURSE GRID */}
          <View style={styles.sectionHeader}>
            <LayoutGrid size={16} color={theme.accent} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              ACTIVE MODULES
            </Text>
          </View>

          <View style={styles.courseGrid}>
            {courses.length === 0 ? (
              <View style={styles.emptyState}>
                <BookOpen
                  size={48}
                  color={theme.secondaryText}
                  strokeWidth={1}
                />
                <Text style={{ color: theme.secondaryText, marginTop: 10 }}>
                  No neural data found.
                </Text>
              </View>
            ) : (
              courses.map((course, index) => (
                <MotiView
                  key={course._id}
                  from={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 100 }}
                  style={[
                    styles.courseCard,
                    {
                      backgroundColor: theme.cardBg,
                      borderColor: theme.accent + "15",
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => router.push(`/course/${course._id}`)}
                    style={{ flex: 1 }}
                  >
                    <View style={styles.cardTop}>
                      <View
                        style={[
                          styles.moduleBadge,
                          { backgroundColor: theme.accent + "22" },
                        ]}
                      >
                        <Text
                          style={[styles.moduleText, { color: theme.accent }]}
                        >
                          MOD-0{index + 1}
                        </Text>
                      </View>
                      <ArrowUpRight size={16} color={theme.secondaryText} />
                    </View>

                    <Text
                      numberOfLines={2}
                      style={[styles.courseTitle, { color: theme.text }]}
                    >
                      {course.title}
                    </Text>

                    <View style={styles.progressSection}>
                      <View style={styles.progressBarBg}>
                        <MotiView
                          from={{ width: "0%" }}
                          animate={{
                            width: `${progressMap[course._id] || 0}%`,
                          }}
                          style={[
                            styles.progressBarFill,
                            { backgroundColor: theme.accent },
                          ]}
                        />
                      </View>
                      <Text
                        style={[styles.progressText, { color: theme.accent }]}
                      >
                        {progressMap[course._id] || 0}%
                      </Text>
                    </View>
                  </TouchableOpacity>
                </MotiView>
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { padding: 24, paddingBottom: 100 },

  headerNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  greeting: { fontSize: 10, fontWeight: "800", letterSpacing: 2 },
  userName: { fontSize: 24, fontWeight: "900", letterSpacing: -0.5 },
  iconButton: {
    width: 45,
    height: 45,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  heroCard: {
    padding: 24,
    borderRadius: 28,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 40,
  },
  heroContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroTitle: { fontSize: 20, fontWeight: "800" },
  heroSub: { fontSize: 13, marginTop: 4 },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 12, fontWeight: "900", letterSpacing: 1.5 },

  courseGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  courseCard: {
    width: (width - 64) / 2,
    height: 180,
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    justifyContent: "space-between",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  moduleBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  moduleText: { fontSize: 9, fontWeight: "800" },
  courseTitle: { fontSize: 15, fontWeight: "700", lineHeight: 20, height: 40 },

  progressSection: { marginTop: "auto" },
  progressBarBg: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 2,
    marginBottom: 6,
    overflow: "hidden",
  },
  progressBarFill: { height: "100%", borderRadius: 2 },
  progressText: { fontSize: 10, fontWeight: "900" },

  emptyState: {
    width: "100%",
    alignItems: "center",
    marginTop: 40,
    opacity: 0.5,
  },
});
