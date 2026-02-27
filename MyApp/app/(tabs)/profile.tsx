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
  Box,
  Layers,
  Fingerprint,
  User as UserIcon,
  ShieldCheck,
  Zap,
  Cpu,
} from "lucide-react-native";

const { width } = Dimensions.get("window");
const API = "https://st-v01.onrender.com";
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
      console.error("PROFILE_FETCH_ERROR:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color={theme.accent} />
        <Text
          style={[
            styles.monoText,
            { color: theme.accent, marginTop: 15, fontSize: 10 },
          ]}
        >
          DECRYPTING_PROFILE...
        </Text>
      </View>
    );
  }

  // --- SAFE DATA HANDLERS ---
  // Using optional chaining and defaults to prevent "undefined" property crashes
  const user = profile?.user || {};
  const stats = profile?.stats || { streak: 0, totalLearningTime: 0 };
  const courses = profile?.courses || [];
  const hasAvatar = !!user?.avatar;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* AMBIENT BACKGROUND GLOW */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <MotiView
          from={{ opacity: 0.1, scale: 1 }}
          animate={{ opacity: 0.2, scale: 1.5 }}
          transition={{ loop: true, duration: 8000, type: "timing" }}
          style={[
            styles.glowOrb,
            { backgroundColor: theme.accent, top: "5%", left: "-20%" },
          ]}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* SECTION 1: THE BIOMETRIC CORE */}
        <View style={styles.coreContainer}>
          {/* Rotating Outer Ring */}
          <MotiView
            from={{ rotate: "0deg" }}
            animate={{ rotate: "360deg" }}
            transition={{
              loop: true,
              duration: 25000,
              type: "timing",
              easing: Easing.linear,
            }}
            style={[styles.orbitalRing, { borderColor: theme.border }]}
          />

          <View
            style={[
              styles.avatarContainer,
              { borderColor: theme.border, backgroundColor: theme.glass },
            ]}
          >
            {hasAvatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImg} />
            ) : (
              <View style={styles.placeholderIcon}>
                <UserIcon size={48} color={theme.accent} strokeWidth={1} />
                <Text
                  style={[
                    styles.monoText,
                    { fontSize: 8, color: theme.accent, marginTop: 5 },
                  ]}
                >
                  NO_VISUAL_ID
                </Text>
              </View>
            )}

            {/* SCANNER ANIMATION */}
            <MotiView
              from={{ translateY: -80, opacity: 0 }}
              animate={{ translateY: 80, opacity: 1 }}
              transition={{
                loop: true,
                duration: 3000,
                type: "timing",
                easing: Easing.inOut(Easing.ease),
              }}
              style={[styles.scanLine, { backgroundColor: theme.accent }]}
            />
          </View>

          <View style={styles.identityContainer}>
            <MotiText
              from={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={[styles.idText, { color: theme.text }]}
            >
              {user?.name ? user.name.toUpperCase() : "ANONYMOUS_ENTITY"}
            </MotiText>

            <View style={styles.statusRow}>
              <Fingerprint size={12} color={theme.accent} />
              <Text
                style={[
                  styles.monoText,
                  { color: theme.accent, marginLeft: 6, fontSize: 10 },
                ]}
              >
                {hasAvatar
                  ? "BIOMETRIC_ENCRYPTION_ACTIVE"
                  : "NEURAL_SIGNATURE_ONLY"}
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
            value="98.4"
            unit="%"
            color={theme.accent}
          />
          <View style={[styles.vLine, { backgroundColor: theme.border }]} />
          <StatBlock
            label="NEURAL_STREAK"
            value={stats.streak || 0}
            unit="DAYS"
            color={theme.secondary}
          />
          <View style={[styles.vLine, { backgroundColor: theme.border }]} />
          <StatBlock
            label="UPLINK_TIME"
            value={Math.floor((stats.totalLearningTime || 0) / 3600)}
            unit="HRS"
            color="#FFF"
          />
        </View>

        {/* SECTION 3: DATA NODES (COURSES) */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.label, { color: theme.muted }]}>
            // ACTIVE_DATA_NODES
          </Text>
          <Layers size={14} color={theme.muted} />
        </View>

        <View style={styles.nexusGrid}>
          {courses.length > 0 ? (
            courses.slice(0, 4).map((c: any, i: number) => (
              <MotiView
                key={i}
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 100 * i }}
                style={[
                  styles.nodeCard,
                  { backgroundColor: theme.glass, borderColor: theme.border },
                ]}
              >
                <Box
                  size={16}
                  color={i === 0 ? theme.accent : theme.muted}
                  style={{ marginBottom: 10 }}
                />
                <Text
                  numberOfLines={1}
                  style={[styles.nodeTitle, { color: theme.text }]}
                >
                  {c.title || "Unknown Node"}
                </Text>
                <Text
                  style={[
                    styles.monoText,
                    { fontSize: 7, marginTop: 4, color: theme.muted },
                  ]}
                >
                  NODE_ID: 0x{i + 104}
                </Text>
              </MotiView>
            ))
          ) : (
            <Text
              style={[
                styles.monoText,
                {
                  color: theme.muted,
                  fontSize: 10,
                  width: "100%",
                  textAlign: "center",
                  marginTop: 20,
                },
              ]}
            >
              NO_ACTIVE_NODES_FOUND
            </Text>
          )}
        </View>

        {/* DISCONNECT ACTION */}
        <TouchableOpacity
          style={styles.disconnectBtn}
          onPress={async () => {
            await AsyncStorage.clear();
            router.replace("/auth/WelcomeScreen");
          }}
        >
          <LogOut size={16} color={theme.muted} />
          <Text style={[styles.disconnectText, { color: theme.muted }]}>
            TERMINATE_NEURAL_SESSION
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- SUB-COMPONENTS ---
function StatBlock({ label, value, unit, color }: any) {
  return (
    <View style={styles.statBlock}>
      <Text
        style={[
          styles.monoText,
          { fontSize: 8, color: "#888", marginBottom: 4 },
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
  scroll: { padding: 25, paddingTop: 20 },
  glowOrb: {
    position: "absolute",
    width: 350,
    height: 350,
    borderRadius: 175,
    filter: Platform.OS === "ios" ? "blur(80px)" : undefined,
  },

  // Biometric Core
  coreContainer: {
    alignItems: "center",
    height: 280,
    justifyContent: "center",
  },
  orbitalRing: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 0.5,
    position: "absolute",
    borderStyle: "dashed",
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
  avatarImg: {
    width: "100%",
    height: "100%",
    opacity: 0.8,
    resizeMode: "cover",
  },
  placeholderIcon: {
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.6,
  },
  scanLine: {
    position: "absolute",
    width: "120%",
    height: 2,
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowColor: "#00F2FE",
    zIndex: 10,
  },

  identityContainer: { alignItems: "center", marginTop: 25 },
  idText: { fontSize: 22, fontWeight: "300", letterSpacing: 5 },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    opacity: 0.8,
  },
  monoText: { fontFamily: MONO, letterSpacing: 1 },

  // Stats
  statsGrid: {
    flexDirection: "row",
    padding: 20,
    borderRadius: 4,
    borderWidth: 1,
    marginTop: 20,
    justifyContent: "space-between",
  },
  statBlock: { alignItems: "center" },
  statValue: { fontSize: 20, fontWeight: "300", fontFamily: MONO },
  vLine: { width: 1, height: "100%", opacity: 0.3 },

  // Nodes
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 35,
    marginBottom: 15,
  },
  label: { fontSize: 10, letterSpacing: 2, fontWeight: "700" },
  nexusGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  nodeCard: {
    width: (width - 62) / 2,
    padding: 18,
    borderWidth: 1,
    borderRadius: 4,
  },
  nodeTitle: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },

  // Footer
  disconnectBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 60,
    marginBottom: 40,
    opacity: 0.5,
  },
  disconnectText: { fontSize: 9, fontWeight: "700", letterSpacing: 2 },
});
