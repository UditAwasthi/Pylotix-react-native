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
  useColorScheme,
  Platform,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";
import { ArrowLeft, GraduationCap, Code2, Cpu, Zap } from "lucide-react-native";

import { getCourse, saveProgress } from "../../services/courseStorage";
import { syncProgress } from "../../services/syncService";

const MONO = Platform.OS === "ios" ? "Menlo" : "monospace";

export default function Learn() {
  const params = useLocalSearchParams();
  const isDark = useColorScheme() === "dark";

  // URL Parameter Handling
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

  const theme = {
    bg: isDark ? "#020205" : "#F4F7FF",
    card: isDark ? "#0A0A0F" : "#FFFFFF",
    accent: "#00F2FE",
    text: isDark ? "#E0E0E0" : "#1A1A1A",
    muted: isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.5)",
    border: isDark ? "rgba(0, 242, 254, 0.2)" : "#E2E8F0",
  };

  useEffect(() => {
    if (courseId) load();
  }, [courseId, chapterIndex, topicIndex]);

  async function load() {
    try {
      setLoading(true); // Ensure loader shows during index switches
      const course = await getCourse(courseId as string);

      if (!course || !course.chapters?.[chapterIndex]?.topics?.[topicIndex]) {
        console.warn(
          "Topic synchronization failed: Data not found in local storage.",
        );
        setTopic(null);
        return;
      }

      const currentTopic = course.chapters[chapterIndex].topics[topicIndex];
      setTopic(currentTopic);

      await saveProgress(courseId, { chapterIndex, topicIndex });
      syncProgress(courseId, chapterIndex, topicIndex);
    } catch (e) {
      console.error("Neural Link Load Error:", e);
    } finally {
      setLoading(false);
    }
  }

  /* --- SAFETY GUARD: PREVENTS NULL POINTER CRASH --- */
  if (loading || !topic) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color={theme.accent} />
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ loop: true, duration: 1000 }}
        >
          <Text
            style={[
              styles.mono,
              { color: theme.accent, marginTop: 20, fontSize: 10 },
            ]}
          >
            ESTABLISHING_NEURAL_UPLINK...
          </Text>
        </MotiView>
      </View>
    );
  }

  /* --- MAIN UI: ONLY RUNS IF TOPIC IS VALID --- */
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* TOP HUD NAVIGATION */}
      <View style={[styles.navBar, { borderBottomColor: theme.border }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={theme.accent} />
        </TouchableOpacity>
        <View style={styles.navInfo}>
          <Text
            style={[styles.mono, styles.navSubtitle, { color: theme.muted }]}
          >
            NODE_SYNC_0{chapterIndex + 1}
          </Text>
          <Text style={[styles.navTitle, { color: theme.text }]}>
            PACKET_{topicIndex + 1}
          </Text>
        </View>
        <Cpu size={20} color={theme.muted} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* PROGRESS BAR HUD */}
        <View style={styles.progressContainer}>
          <View
            style={[styles.progressBarBase, { backgroundColor: theme.border }]}
          >
            <MotiView
              from={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: 1500,
                type: "timing",
                easing: Easing.out(Easing.quad),
              }}
              style={[
                styles.progressBarFill,
                { backgroundColor: theme.accent },
              ]}
            />
          </View>
          <Text
            style={[
              styles.mono,
              { fontSize: 8, color: theme.accent, marginTop: 5 },
            ]}
          >
            DECRYPTING_DATA_STREAM...
          </Text>
        </View>

        {/* HEADER SECTION */}
        <MotiView
          from={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 200 }}
        >
          <View style={styles.badge}>
            <Zap size={10} color={theme.accent} />
            <Text
              style={[styles.mono, styles.badgeText, { color: theme.accent }]}
            >
              LIVE_UPLINK
            </Text>
          </View>
          <Text style={[styles.title, { color: theme.text }]}>
            {topic.title?.toUpperCase()}
          </Text>
          <Text style={[styles.desc, { color: theme.muted }]}>
            {topic.content?.description}
          </Text>
        </MotiView>

        {/* CONTENT PACKETS */}
        <View style={styles.contentBody}>
          {topic.content?.sections?.map((s: any, i: number) => {
            if (s.type === "text") {
              return (
                <MotiView
                  key={i}
                  from={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 400 + i * 100 }}
                >
                  <Text style={[styles.text, { color: theme.text }]}>
                    {s.value}
                  </Text>
                </MotiView>
              );
            }

            if (s.type === "code_example") {
              return (
                <MotiView
                  key={i}
                  from={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 500 }}
                >
                  <View
                    style={[
                      styles.codeContainer,
                      { borderColor: theme.border },
                    ]}
                  >
                    <View style={styles.codeHeader}>
                      <Code2 size={14} color={theme.accent} />
                      <Text
                        style={[
                          styles.mono,
                          { color: theme.accent, fontSize: 10 },
                        ]}
                      >
                        SOURCE_DECRYPTION
                      </Text>
                    </View>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
                      <Text style={[styles.codeText, { color: theme.accent }]}>
                        {s.code}
                      </Text>
                    </ScrollView>
                  </View>
                </MotiView>
              );
            }
            return null;
          })}
        </View>

        {/* TERMINAL FOOTER ACTION */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.quizBtn, { backgroundColor: theme.accent }]}
          onPress={() =>
            router.push({
              pathname: "/course/quiz",
              params: { courseId, chapterIndex, topicIndex },
            })
          }
        >
          <GraduationCap size={20} color="#000" />
          <Text style={styles.quizBtnText}>COMMENCE_EVALUATION</Text>
        </TouchableOpacity>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  mono: { fontFamily: MONO, letterSpacing: 1 },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  iconBtn: { padding: 8 },
  navInfo: { alignItems: "center" },
  navSubtitle: { fontSize: 8, fontWeight: "800" },
  navTitle: { fontSize: 14, fontWeight: "900", letterSpacing: 2 },
  progressContainer: { paddingHorizontal: 25, marginTop: 20 },
  progressBarBase: { height: 2, width: "100%", borderRadius: 1 },
  progressBarFill: { height: "100%", borderRadius: 1 },
  scrollContent: { padding: 25 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 6,
  },
  badgeText: { fontSize: 9, fontWeight: "800" },
  title: { fontSize: 26, fontWeight: "200", letterSpacing: 4, lineHeight: 32 },
  desc: { marginTop: 15, fontSize: 14, lineHeight: 22, fontWeight: "400" },
  contentBody: { marginTop: 20 },
  text: { marginTop: 20, fontSize: 15, lineHeight: 26, fontWeight: "400" },
  codeContainer: {
    backgroundColor: "#000",
    borderRadius: 4,
    marginTop: 30,
    overflow: "hidden",
    borderWidth: 1,
  },
  codeHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "rgba(0, 242, 254, 0.05)",
    gap: 10,
  },
  codeText: {
    padding: 20,
    fontFamily: MONO,
    fontSize: 13,
    lineHeight: 20,
    opacity: 0.9,
  },
  quizBtn: {
    flexDirection: "row",
    paddingVertical: 20,
    marginTop: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
    gap: 12,
    shadowColor: "#00F2FE",
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  quizBtnText: {
    color: "black",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
  },
});
