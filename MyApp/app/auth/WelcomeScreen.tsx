import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
  Image,
} from "react-native";
import { MotiView, MotiText } from "moti";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Gyroscope } from "expo-sensors";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from "react-native-reanimated";

export default function WelcomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

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
    const rotateY = interpolate(gyroY.value, [-2, 2], [-15, 15]);
    const rotateX = interpolate(gyroX.value, [-2, 2], [15, -15]);

    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${rotateY}deg` },
        { rotateX: `${rotateX}deg` },
      ],
    };
  });

  const theme = {
    background: isDark ? "#0F172A" : "#FFFFFF",
    card: isDark ? "#1E293B" : "#F8FAFC",
    text: isDark ? "#F8FAFC" : "#1E293B",
    primary: "#4F46E5",
    accent: "#10B981",
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Background Glow */}
      <MotiView
        from={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.12 }}
        transition={{ type: "timing", duration: 2000 }}
        style={[styles.circle, { backgroundColor: theme.primary }]}
      />

      <View style={styles.content}>
        {/* Your Logo with Parallax */}
        <MotiView
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 12 }}
          style={styles.heroSection}
        >
          <Animated.View
            style={[
              styles.logoContainer,
              { backgroundColor: theme.card },
              animatedHeroStyle,
            ]}
          >
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.logo}
            />
            {/* Subtle "Light Reflection" Dot */}
            <View
              style={[styles.indicator, { backgroundColor: theme.accent }]}
            />
          </Animated.View>
        </MotiView>

        {/* Brand & Copy */}
        <View style={styles.textSection}>
          <MotiText
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 500 }}
            style={[styles.title, { color: theme.text }]}
          >
            Welcome to{"\n"}
            <Text style={{ color: theme.primary }}>Pylotix</Text>
          </MotiText>

          <MotiText
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 700 }}
            style={[styles.subtitle, { color: isDark ? "#94A3B8" : "#64748B" }]}
          >
            Empowering your learning journey with precision and speed.
          </MotiText>
        </View>

        {/* Footer & CTA */}
        <View style={styles.footer}>
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 900 }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.replace("/signup")}
              style={[styles.button, { backgroundColor: theme.primary }]}
            >
              <Text style={styles.buttonText}>Get Started</Text>
              <MotiView
                animate={{ translateX: [0, 5, 0] }}
                transition={{ loop: true, duration: 2000, type: "timing" }}
              >
                <Feather
                  name="arrow-right"
                  size={20}
                  color="white"
                  style={{ marginLeft: 10 }}
                />
              </MotiView>
            </TouchableOpacity>
          </MotiView>

          <MotiText
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1100 }}
            style={[
              styles.loginText,
              { color: isDark ? "#475569" : "#94A3B8" },
            ]}
          >
            Already have an account?{" "}
            <Text
              onPress={() => router.replace("/login")}
              style={{
                color: theme.primary,
                fontWeight: "700",
              }}
            >
              Log In
            </Text>
          </MotiText>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: "space-between",
    paddingVertical: 50,
  },
  circle: {
    position: "absolute",
    top: -100,
    right: -100,
    width: 350,
    height: 350,
    borderRadius: 175,
  },
  heroSection: {
    alignItems: "center",
    marginTop: 20,
  },
  logoContainer: {
    width: 170,
    height: 170,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    // Elevation for Android
    elevation: 15,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  indicator: {
    position: "absolute",
    top: 25,
    right: 25,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  textSection: {
    marginTop: -30,
  },
  title: {
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: -1.5,
    lineHeight: 48,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 12,
    lineHeight: 28,
  },
  footer: {
    width: "100%",
  },
  button: {
    flexDirection: "row",
    height: 64,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  loginText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },
});
