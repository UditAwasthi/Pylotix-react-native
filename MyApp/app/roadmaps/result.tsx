import React from "react";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Dimensions,
  useColorScheme,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function FuturisticRoadmap() {
  const params = useLocalSearchParams();
  const roadmap = JSON.parse(params.roadmap as string);

  // Detect device theme
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Dynamic Theme Palette
  const theme = {
    bg: isDark ? ["#050A0E", "#0D161F"] : ["#F8FAFC", "#F1F5F9"],
    card: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(255, 255, 255, 0.9)",
    border: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
    textMain: isDark ? "#FFFFFF" : "#1E293B",
    textSub: isDark ? "#A0AEC0" : "#64748B",
    accent: isDark ? "#00F2FE" : "#2563EB",
    line: isDark ? "rgba(0, 242, 254, 0.2)" : "rgba(37, 99, 235, 0.2)",
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={theme.bg} style={StyleSheet.absoluteFill} />

      <ScrollView
        contentContainerStyle={styles.scrollPadding}
        showsVerticalScrollIndicator={false}
      >
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          style={styles.header}
        >
          <Text style={[styles.title, { color: theme.textMain }]}>
            {roadmap.skill}
          </Text>
          <Text style={[styles.subtitle, { color: theme.accent }]}>
            NEURAL LEARNING PATHWAY
          </Text>
        </MotiView>

        {roadmap.roadmap.map((month: any, mIdx: number) => (
          <View key={month.month} style={styles.monthWrapper}>
            <View
              style={[
                styles.monthTag,
                {
                  backgroundColor: `${theme.accent}15`,
                  borderLeftColor: theme.accent,
                },
              ]}
            >
              <Text style={[styles.monthTagText, { color: theme.accent }]}>
                PHASE {month.month}
              </Text>
            </View>

            {month.weeks.map((week: any, wIdx: number) => (
              <View key={week.week} style={styles.nodeContainer}>
                {/* The Connector Line */}
                <View style={styles.connectorLine}>
                  <LinearGradient
                    colors={[theme.accent, theme.line, "transparent"]}
                    style={styles.lineGradient}
                  />
                </View>

                {/* The Node Dot */}
                <MotiView
                  from={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: wIdx * 100, type: "spring" }}
                  style={[
                    styles.nodeDot,
                    {
                      borderColor: theme.accent,
                      backgroundColor: `${theme.accent}33`,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.innerDot,
                      {
                        backgroundColor: theme.accent,
                        shadowColor: theme.accent,
                      },
                    ]}
                  />
                </MotiView>

                {/* The Task Card */}
                <MotiView
                  from={{ opacity: 0, translateX: 20 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{ delay: wIdx * 150 }}
                  style={[
                    styles.glassCard,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                      shadowOpacity: isDark ? 0 : 0.05,
                    },
                  ]}
                >
                  <Text style={[styles.weekTitle, { color: theme.textMain }]}>
                    Week {week.week}
                  </Text>

                  {week.tasks.map((task: any, i: number) => (
                    <View key={i} style={styles.taskRow}>
                      <Text style={[styles.taskText, { color: theme.textSub }]}>
                        <Text style={{ color: theme.accent }}>•</Text> {task}
                      </Text>
                    </View>
                  ))}
                </MotiView>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollPadding: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 3,
    marginTop: 4,
  },
  monthWrapper: {
    marginBottom: 10,
  },
  monthTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 25,
    borderLeftWidth: 3,
  },
  monthTagText: {
    fontSize: 11,
    fontWeight: "800",
  },
  nodeContainer: {
    flexDirection: "row",
    marginBottom: 25,
    minHeight: 80,
  },
  connectorLine: {
    position: "absolute",
    left: 7,
    top: 24,
    bottom: -30,
    width: 2,
  },
  lineGradient: {
    flex: 1,
    width: "100%",
  },
  nodeDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
    zIndex: 10,
    borderWidth: 1.5,
  },
  innerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    shadowRadius: 8,
    shadowOpacity: 0.8,
  },
  glassCard: {
    flex: 1,
    marginLeft: 20,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    // Light mode shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
  },
  weekTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  taskRow: {
    marginBottom: 8,
  },
  taskText: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "500",
  },
});
