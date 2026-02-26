import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import { MotiView, MotiText } from "moti";
import { ShieldCheck, ArrowRight, Cpu, Zap } from "lucide-react-native";

export default function Cert() {
  const THEME = {
    yellow: "#FFE200",
    black: "#000000",
    gray: "#1A1A1A",
    textGray: "#888888",
    white: "#FFFFFF",
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(tabs)/home");
    }, 4000); // Slightly longer to appreciate the animations

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: THEME.black }]}>
      <StatusBar barStyle="light-content" />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* TOP DECAL */}
          <MotiView
            from={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={styles.headerDecal}
          >
            <Cpu size={14} color={THEME.yellow} />
            <Text style={[styles.decalText, { color: THEME.yellow }]}>
              ARCHIVE_ENTRY_COMPLETE
            </Text>
          </MotiView>

          {/* MAIN ICON / SHIELD */}
          <MotiView
            from={{ scale: 0.5, opacity: 0, rotate: "-15deg" }}
            animate={{ scale: 1, opacity: 1, rotate: "0deg" }}
            transition={{ type: "spring", damping: 12 }}
            style={[styles.iconFrame, { borderColor: THEME.yellow }]}
          >
            <ShieldCheck size={60} color={THEME.yellow} strokeWidth={1.5} />
            {/* Corner Accents */}
            <View
              style={[
                styles.corner,
                {
                  top: -2,
                  left: -2,
                  borderLeftWidth: 4,
                  borderTopWidth: 4,
                  borderColor: THEME.yellow,
                },
              ]}
            />
            <View
              style={[
                styles.corner,
                {
                  bottom: -2,
                  right: -2,
                  borderRightWidth: 4,
                  borderBottomWidth: 4,
                  borderColor: THEME.yellow,
                },
              ]}
            />
          </MotiView>

          {/* TEXT CONTENT */}
          <View style={styles.textGroup}>
            <MotiText
              from={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 300 }}
              style={[styles.title, { color: THEME.white }]}
            >
              MODULE_CLEARED
            </MotiText>

            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 500 }}
              style={styles.badgeRow}
            >
              <Zap size={12} color={THEME.black} fill={THEME.black} />
              <Text style={styles.badgeText}>NEURAL_LINK_VERIFIED</Text>
            </MotiView>

            <Text style={[styles.subtitle, { color: THEME.textGray }]}>
              Certificate has been signed and encrypted into your local
              data-bank.
            </Text>
          </View>

          {/* AUTO-REDIRECT SCANNER */}
          <View style={styles.loaderContainer}>
            <View style={[styles.track, { backgroundColor: THEME.gray }]}>
              <MotiView
                from={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 4000, type: "timing" }}
                style={[styles.bar, { backgroundColor: THEME.yellow }]}
              />
            </View>
            <Text style={[styles.redirectText, { color: THEME.yellow }]}>
              REDIRECTING_TO_HOME...
            </Text>
          </View>

          {/* MANUAL BUTTON */}
          <MotiView
            from={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 800 }}
          >
            <TouchableOpacity
              style={[styles.button, { backgroundColor: THEME.yellow }]}
              onPress={() => router.replace("/(tabs)/home")}
              activeOpacity={0.9}
            >
              <Text style={[styles.buttonText, { color: THEME.black }]}>
                TERMINATE_SESSION
              </Text>
              <ArrowRight size={18} color={THEME.black} />
            </TouchableOpacity>
          </MotiView>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingTop: 80,
    paddingBottom: 100,
  },

  headerDecal: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 40,
    opacity: 0.6,
  },
  decalText: { fontSize: 10, fontWeight: "900", letterSpacing: 2 },

  iconFrame: {
    width: 140,
    height: 140,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
    position: "relative",
  },
  corner: { position: "absolute", width: 20, height: 20 },

  textGroup: { alignItems: "center", marginBottom: 60 },
  title: {
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -1,
    marginBottom: 12,
  },

  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFE200",
    paddingHorizontal: 12,
    paddingVertical: 4,
    gap: 6,
    marginBottom: 20,
  },
  badgeText: {
    color: "#000",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },

  subtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "500",
  },

  loaderContainer: { width: "100%", alignItems: "center", marginBottom: 40 },
  track: { width: "100%", height: 2, marginBottom: 12 },
  bar: { height: "100%" },
  redirectText: { fontSize: 9, fontWeight: "800", letterSpacing: 1.5 },

  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 30,
    paddingVertical: 18,
    borderRadius: 0, // Hard edges for Cyberpunk
  },
  buttonText: { fontWeight: "900", fontSize: 14, letterSpacing: 1 },
});
