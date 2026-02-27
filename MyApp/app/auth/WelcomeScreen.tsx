import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  StatusBar,
  Dimensions,
  useColorScheme,
  Image,
} from "react-native";
import { MotiView, MotiText } from "moti";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronRight, ShieldCheck } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { Gyroscope } from "expo-sensors";
import { useFonts, Marcellus_400Regular } from "@expo-google-fonts/marcellus";
import {
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
  withSpring,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

export default function IndustryStandardBlueScreen() {
  const isDark = useColorScheme() === "dark";

  let [fontsLoaded] = useFonts({
    Marcellus_400Regular,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  const theme = {
    background: isDark ? "#04080F" : "#F5F9FF",
    card: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.8)",
    border: isDark ? "rgba(0, 122, 255, 0.2)" : "rgba(0, 122, 255, 0.1)",
    primary: "#007AFF", // Industry Standard Blue
    accent: "#00F2FE", // High-Tech Cyan
    text: isDark ? "#FFFFFF" : "#1C1C1E",
    muted: isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(28, 28, 30, 0.6)",
  };

  const gyroX = useSharedValue(0);
  const gyroY = useSharedValue(0);
  const glowPulse = useSharedValue(0);

  useEffect(() => {
    glowPulse.value = withRepeat(withTiming(1, { duration: 4000 }), -1, true);

    Gyroscope.setUpdateInterval(16);
    const subscription = Gyroscope.addListener(({ x, y }) => {
      gyroX.value = withSpring(x * 10, { damping: 20 });
      gyroY.value = withSpring(y * 10, { damping: 20 });
    });

    return () => subscription.remove();
  }, []);

  const logoParallaxStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: gyroY.value * 1.5 },
      { translateY: gyroX.value * 1.5 },
    ],
  }));

  const cardParallaxStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: gyroY.value * 0.5 },
      { translateY: gyroX.value * 0.5 },
      { rotateX: `${-gyroX.value * 0.08}deg` },
      { rotateY: `${gyroY.value * 0.08}deg` },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glowPulse.value, [0, 1], [0.15, 0.35]),
    transform: [{ scale: interpolate(glowPulse.value, [0, 1], [1, 1.2]) }],
  }));

  const handleAction = (path: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace(path);
  };

  if (!fontsLoaded) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* BLUE AMBIENT GLOWS */}
      <View style={StyleSheet.absoluteFill}>
        <Animated.View
          style={[
            styles.glowOrb,
            { backgroundColor: theme.primary, top: -100, left: -50 },
            glowStyle,
          ]}
        />
        <Animated.View
          style={[
            styles.glowOrb,
            { backgroundColor: theme.accent, bottom: -150, right: -50 },
            glowStyle,
          ]}
        />
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.content}>
          {/* VERSION TAG */}
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            style={styles.headerDecoration}
          >
            <Text
              style={[
                styles.versionText,
                { color: theme.primary, fontFamily: "Poppins_600SemiBold" },
              ]}
            >
              v2.0.4
            </Text>
          </MotiView>

          {/* LOGO UNIT */}
          <View style={styles.heroSection}>
            <Animated.View style={[styles.logoWrapper, logoParallaxStyle]}>
              <View
                style={[
                  styles.glassCircle,
                  { borderColor: theme.border, backgroundColor: theme.card },
                ]}
              >
                <Image
                  source={require("../../assets/images/logo.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
              {/* Technical Orbital Ring */}
              <MotiView
                animate={{ rotate: "360deg" }}
                transition={{ loop: true, duration: 15000, type: "timing" }}
                style={[
                  styles.ring,
                  {
                    borderColor: theme.primary,
                    borderStyle: "dashed",
                    opacity: 0.2,
                  },
                ]}
              />
            </Animated.View>
          </View>

          {/* MAIN CARD */}
          <Animated.View
            style={[
              styles.glassCard,
              { backgroundColor: theme.card, borderColor: theme.border },
              cardParallaxStyle,
            ]}
          >
            <MotiText
              style={[
                styles.title,
                { color: theme.text, fontFamily: "Marcellus_400Regular" },
              ]}
            >
              PYLOTIX
            </MotiText>
            <View
              style={[styles.accentBar, { backgroundColor: theme.primary }]}
            />
            <Text
              style={[
                styles.subtitle,
                { color: theme.muted, fontFamily: "Poppins_400Regular" },
              ]}
            >
              Advanced Data Intelligence Platform.{"\n"}
              Built for the next generation of enterprise.
            </Text>
          </Animated.View>

          {/* FOOTER ACTIONS */}
          <View style={styles.footer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleAction("/signup")}
              style={[styles.premiumButton, { backgroundColor: theme.primary }]}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: "#FFF", fontFamily: "Poppins_600SemiBold" },
                ]}
              >
                Get Started
              </Text>
              <ChevronRight size={18} color="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleAction("/login")}
              style={styles.loginBtn}
            >
              <Text
                style={[
                  styles.loginText,
                  { color: theme.text, fontFamily: "Poppins_400Regular" },
                ]}
              >
                Already have an account?{" "}
                <Text style={{ color: theme.primary, fontWeight: "700" }}>
                  Sign In
                </Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* SECURITY STATUS */}
          <View style={styles.securityBadge}>
            <ShieldCheck size={14} color={theme.primary} />
            <Text style={[styles.securityText, { color: theme.muted }]}>
              End-to-End Encrypted Environment
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  glowOrb: {
    position: "absolute",
    width: 350,
    height: 350,
    borderRadius: 175,
    filter: Platform.OS === "ios" ? "blur(80px)" : undefined,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 40,
  },
  headerDecoration: { paddingHorizontal: 20 },
  versionText: { fontSize: 10, letterSpacing: 2, opacity: 0.8 },
  heroSection: { height: 220, justifyContent: "center", alignItems: "center" },
  logoWrapper: { justifyContent: "center", alignItems: "center" },
  glassCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
      },
      android: { elevation: 5 },
    }),
  },
  logo: { width: 70, height: 70 },
  ring: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
  },
  glassCard: {
    width: width * 0.85,
    paddingVertical: 45,
    paddingHorizontal: 25,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
  },
  title: { fontSize: 40, letterSpacing: 8, textAlign: "center" },
  accentBar: { width: 40, height: 3, borderRadius: 2, marginVertical: 20 },
  subtitle: { fontSize: 14, textAlign: "center", lineHeight: 22, opacity: 0.9 },
  footer: { width: "100%", alignItems: "center", gap: 20 },
  premiumButton: {
    width: width * 0.8,
    height: 60,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonText: { fontSize: 16 },
  loginBtn: { padding: 10 },
  loginText: { fontSize: 13 },
  securityBadge: { flexDirection: "row", alignItems: "center", gap: 8 },
  securityText: { fontSize: 10, letterSpacing: 0.3 },
});
