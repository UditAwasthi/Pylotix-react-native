import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
  Image,
  Platform,
  StatusBar,
} from "react-native";
import { MotiView, MotiText } from "moti";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Gyroscope } from "expo-sensors";
import { Zap, ChevronRight, Cpu, ShieldCheck } from "lucide-react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from "react-native-reanimated";

const MONO = Platform.OS === "ios" ? "Menlo" : "monospace";

export default function WelcomeScreen() {
  const isDark = useColorScheme() === "dark";

  // Parallax Logic
  const gyroX = useSharedValue(0);
  const gyroY = useSharedValue(0);

  useEffect(() => {
    Gyroscope.setUpdateInterval(16);
    const subscription = Gyroscope.addListener(({ x, y }) => {
      gyroX.value = withSpring(x, { damping: 15 });
      gyroY.value = withSpring(y, { damping: 15 });
    });
    return () => subscription.remove();
  }, []);

  const animatedHeroStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(gyroY.value, [-2, 2], [-10, 10]);
    const rotateX = interpolate(gyroX.value, [-2, 2], [10, -10]);
    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${rotateY}deg` },
        { rotateX: `${rotateX}deg` },
      ],
    };
  });

  const theme = {
    background: "#020205", // Deepest black
    card: "rgba(255, 255, 255, 0.03)",
    text: "#FFFFFF",
    primary: "#00F2FE", // Cyan Neon
    muted: "rgba(255, 255, 255, 0.4)",
    border: "rgba(0, 242, 254, 0.2)",
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar barStyle="light-content" />

      {/* BACKGROUND DECOR - NEURAL GRID */}
      <View style={styles.backgroundOverlay}>
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 2000 }}
          style={[styles.glowOrb, { backgroundColor: theme.primary }]}
        />
      </View>

      <View style={styles.content}>
        {/* TOP HUD INFO */}
        <View style={styles.topHud}>
          <Cpu size={14} color={theme.primary} />
          <Text style={[styles.mono, { color: theme.primary, fontSize: 10 }]}>
            PROTOCOL_INIT: 0x229
          </Text>
        </View>

        {/* HERO LOGO WITH PARALLAX */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={styles.heroSection}
        >
          <Animated.View style={[styles.logoWrapper, animatedHeroStyle]}>
            <View style={[styles.logoFrame, { borderColor: theme.border }]}>
              <Image
                source={require("../../assets/images/logo.png")}
                style={styles.logo}
              />
            </View>
            {/* Pulsing Scanner Ring */}
            <MotiView
              from={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 0.3 }}
              transition={{ loop: true, duration: 2000, type: "timing" }}
              style={[styles.scannerRing, { borderColor: theme.primary }]}
            />
          </Animated.View>
        </MotiView>

        {/* BRANDING SECTION */}
        <View style={styles.textSection}>
          <View style={styles.badge}>
            <Zap size={10} color={theme.primary} />
            <Text style={[styles.mono, { color: theme.primary, fontSize: 9 }]}>
              LIVE_NODE_SYNC
            </Text>
          </View>

          <MotiText
            from={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 400 }}
            style={[styles.title, { color: theme.text }]}
          >
            PYLOTIX
          </MotiText>

          <MotiText
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 600 }}
            style={[styles.subtitle, { color: theme.muted }]}
          >
            Connect to the neural stream. Experience deep-learning optimization
            with Pylotix core.
          </MotiText>
        </View>

        {/* ACTION FOOTER */}
        <View style={styles.footer}>
          <MotiView
            from={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 800 }}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.replace("/signup")}
              style={[styles.mainButton, { backgroundColor: theme.primary }]}
            >
              <Text style={[styles.mono, styles.buttonText]}>
                INITIALIZE_SYNC
              </Text>
              <ChevronRight size={18} color="#000" />
            </TouchableOpacity>
          </MotiView>

          <TouchableOpacity
            onPress={() => router.replace("/login")}
            style={styles.loginLink}
          >
            <Text style={[styles.mono, { color: theme.muted, fontSize: 11 }]}>
              EXISTING_UPLINK?{" "}
              <Text style={{ color: theme.primary }}>RESUME_SESSION</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* HUD DECORATIVE FOOTER */}
      <View style={styles.bottomHud}>
        <ShieldCheck size={12} color={theme.muted} />
        <Text style={[styles.mono, { color: theme.muted, fontSize: 8 }]}>
          ENCRYPTED_DATA_LINE_SECURED
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mono: { fontFamily: MONO, letterSpacing: 2, fontWeight: "700" },
  backgroundOverlay: { ...StyleSheet.absoluteFillObject, overflow: "hidden" },
  glowOrb: {
    position: "absolute",
    top: -150,
    right: -150,
    width: 400,
    height: 400,
    borderRadius: 200,
    filter: Platform.OS === "ios" ? "blur(80px)" : undefined, // Android doesn't support filter well
  },
  content: {
    flex: 1,
    paddingHorizontal: 35,
    justifyContent: "space-between",
    paddingVertical: 40,
  },

  // HUD Elements
  topHud: { flexDirection: "row", alignItems: "center", gap: 10, opacity: 0.6 },
  bottomHud: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },

  // Hero Section
  heroSection: { alignItems: "center", justifyContent: "center" },
  logoWrapper: {
    width: 180,
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  logoFrame: {
    width: 140,
    height: 140,
    borderRadius: 2, // Sharp edges
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.02)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  logo: { width: 90, height: 90, resizeMode: "contain" },
  scannerRing: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderStyle: "dashed",
  },

  // Text
  textSection: { marginTop: -20 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 15,
  },
  title: { fontSize: 44, fontWeight: "200", letterSpacing: 10, lineHeight: 52 },
  subtitle: { fontSize: 13, marginTop: 15, lineHeight: 22, letterSpacing: 0.5 },

  // Buttons
  footer: { width: "100%", gap: 20 },
  mainButton: {
    flexDirection: "row",
    height: 60,
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00F2FE",
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  buttonText: { color: "#000", fontSize: 13, fontWeight: "900" },
  loginLink: { alignItems: "center", paddingVertical: 10 },
});
