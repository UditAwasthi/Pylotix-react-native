import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Dimensions,
  useColorScheme,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { MotiView, MotiText } from "moti";
import { Easing } from "react-native-reanimated";
import {
  LogOut,
  Cpu,
  Zap,
  Activity,
  Shield,
  Box,
  Terminal,
  Layers,
  Fingerprint,
} from "lucide-react-native";

const { width, height } = Dimensions.get("window");
const API = "https://st-v01.onrender.com";

// Tech-Font selection based on platform
const MONO = Platform.OS === "ios" ? "Menlo" : "monospace";

export default function NeuralLinkProfile() {
  const isDark = useColorScheme() === "dark";
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const theme = {
    bg: isDark ? "#020205" : "#F4F7FF",
    accent: "#00F2FE",
    secondary: "#7000FF",
    text: isDark ? "#FFFFFF" : "#0A0A0A",
    muted: isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.5)",
    glass: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
    border: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
  };

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const res = await fetch(`${API}/profile/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProfile(data);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  if (loading || !profile)
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );

  const { user, stats, courses } = profile;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle="light-content" />

      {/* AMBIENT BACKGROUND LAYER */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <MotiView
          from={{ opacity: 0.1, scale: 1, x: -50 }}
          animate={{ opacity: 0.25, scale: 1.5, x: 50 }}
          transition={{ loop: true, duration: 6000, type: "timing" }}
          style={[
            styles.glowOrb,
            { backgroundColor: theme.accent, top: "10%" },
          ]}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* SECTION 1: THE BIOMETRIC CORE */}
        <View style={styles.coreContainer}>
          <MotiView
            from={{ rotate: "0deg" }}
            animate={{ rotate: "360deg" }}
            transition={{
              loop: true,
              duration: 20000,
              type: "timing",
              easing: Easing.linear,
            }}
            style={[styles.orbitalRing, { borderColor: theme.border }]}
          />

          <View style={[styles.avatarContainer, { borderColor: theme.border }]}>
            <Image
              source={{ uri: user.avatar || "https://i.pravatar.cc/300" }}
              style={styles.avatarImg}
            />

            {/* THE BIOMETRIC SCAN LINE */}
            <MotiView
              from={{ translateY: -70, opacity: 0 }}
              animate={{ translateY: 70, opacity: 1 }}
              transition={{
                loop: true,
                duration: 2500,
                type: "timing",
                easing: Easing.inOut(Easing.ease),
              }}
              style={[styles.scanLine, { backgroundColor: theme.accent }]}
            />
            <View
              style={[
                styles.overlay,
                {
                  backgroundColor: isDark
                    ? "rgba(0, 242, 254, 0.05)"
                    : "transparent",
                },
              ]}
            />
          </View>

          <View style={styles.identityContainer}>
            <MotiText
              from={{ opacity: 0, tracking: 10 }}
              animate={{ opacity: 1, tracking: 6 }}
              style={[styles.idText, { color: theme.text }]}
            >
              {user.name.toUpperCase()}
            </MotiText>
            <View style={styles.statusRow}>
              <Fingerprint size={10} color={theme.accent} />
              <Text
                style={[
                  styles.monoText,
                  { color: theme.accent, marginLeft: 5 },
                ]}
              >
                BIOMETRIC_LINK_VERIFIED
              </Text>
            </View>
          </View>
        </View>

        {/* SECTION 2: NEURAL STATS */}
        <View
          style={[
            styles.statsGrid,
            { backgroundColor: theme.glass, borderColor: theme.border },
          ]}
        >
          <StatBlock
            label="SYNC_RATE"
            value="98.2"
            unit="%"
            color={theme.accent}
          />
          <View style={[styles.vLine, { backgroundColor: theme.border }]} />
          <StatBlock
            label="NEURAL_STREAK"
            value={stats.streak}
            unit="DAYS"
            color={theme.secondary}
          />
          <View style={[styles.vLine, { backgroundColor: theme.border }]} />
          <StatBlock
            label="RUNTIME"
            value={Math.floor(stats.totalLearningTime / 3600)}
            unit="HRS"
            color="#FFF"
          />
        </View>

        {/* SECTION 3: MODULE NODES */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.label, { color: theme.muted }]}>
            // NEURAL_DATABASE_NODES
          </Text>
          <Layers size={12} color={theme.muted} />
        </View>

        <View style={styles.nexusGrid}>
          {courses.slice(0, 4).map((c: any, i: number) => (
            <MotiView
              key={i}
              from={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 300 + i * 100 }}
              style={[
                styles.nodeCard,
                { backgroundColor: theme.glass, borderColor: theme.border },
              ]}
            >
              <Box
                size={18}
                color={i === 0 ? theme.accent : theme.muted}
                style={{ marginBottom: 12 }}
              />
              <Text
                numberOfLines={1}
                style={[styles.nodeTitle, { color: theme.text }]}
              >
                {c.title}
              </Text>
              <Text
                style={[
                  styles.monoText,
                  { fontSize: 8, marginTop: 4, color: theme.muted },
                ]}
              >
                NODE_0{i + 1}
              </Text>
            </MotiView>
          ))}
        </View>

   
        {/* DISCONNECT */}
        <TouchableOpacity
          style={styles.disconnectBtn}
          onPress={() => {
            AsyncStorage.clear();
            router.replace("/");
          }}
        >
          <Text style={[styles.disconnectText, { color: theme.muted }]}>
            TERMINATE_NEURAL_LINK
          </Text>
          <LogOut size={14} color={theme.muted} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBlock({ label, value, unit, color }: any) {
  return (
    <View style={styles.statBlock}>
      <Text
        style={[
          styles.monoText,
          { fontSize: 8, color: "#888", marginBottom: 5 },
        ]}
      >
        {label}
      </Text>
      <View style={{ flexDirection: "row", alignItems: "baseline" }}>
        <Text style={[styles.statValue, { color: "#FFF" }]}>{value}</Text>
        <Text style={[styles.monoText, { fontSize: 8, marginLeft: 3, color }]}>
          {unit}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  scroll: { padding: 25, paddingTop: 40 },
  glowOrb: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: 200,
    filter: "blur(100px)" as any,
  },

  // Header & Core
  coreContainer: {
    alignItems: "center",
    height: 300,
    justifyContent: "center",
  },
  orbitalRing: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 0.5,
    position: "absolute",
  },
  avatarContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImg: { width: "100%", height: "100%", opacity: 0.8 },
  scanLine: {
    position: "absolute",
    width: "120%",
    height: 2,
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowColor: "#00F2FE",
    zIndex: 10,
  },
  overlay: { ...StyleSheet.absoluteFillObject },

  identityContainer: { alignItems: "center", marginTop: 30 },
  idText: { fontSize: 24, fontWeight: "200", letterSpacing: 6 }, // Ultra light, high tracking
  statusRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  monoText: { fontFamily: MONO, letterSpacing: 1, fontWeight: "600" },

  // Stats Grid
  statsGrid: {
    flexDirection: "row",
    padding: 20,
    borderRadius: 2,
    borderWidth: 1,
    marginTop: 30,
    justifyContent: "space-between",
  },
  statBlock: { alignItems: "center" },
  statValue: { fontSize: 22, fontWeight: "300", fontFamily: MONO },
  vLine: { width: 1, height: "100%" },

  // Nexus Grid
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  label: { fontSize: 10, letterSpacing: 2, fontWeight: "700" },
  nexusGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  nodeCard: {
    width: (width - 62) / 2,
    padding: 20,
    borderWidth: 1,
    borderRadius: 2,
  },
  nodeTitle: { fontSize: 12, fontWeight: "800", letterSpacing: 1 },

  // Terminal
  terminal: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderWidth: 1,
  },
  terminalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: "#00F2FE" },
  log: { fontFamily: MONO, fontSize: 10, color: "#555", marginBottom: 4 },

  // Footer
  disconnectBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 50,
    marginBottom: 30,
  },
  disconnectText: { fontSize: 10, fontWeight: "700", letterSpacing: 2 },
});
