import { Tabs } from "expo-router";
import { Home, PlusCircle, BookOpen, User } from "lucide-react-native";
import { useColorScheme, Platform } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // THEME STYLING
        tabBarStyle: {
          backgroundColor: isDark ? "rgba(2, 2, 5, 0.95)" : "#F4F7FF",
          borderTopWidth: 1,
          borderTopColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)",
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 30 : 12,
          paddingTop: 12,
          position: 'absolute', // Makes it float over the background orbs
          elevation: 0,
        },
        tabBarActiveTintColor: "#00F2FE", // Cyan HUD Accent
        tabBarInactiveTintColor: isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.4)",
        tabBarLabelStyle: {
          fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
          fontSize: 10,
          fontWeight: '700',
          letterSpacing: 1,
          marginTop: 4,
        },
      }}
    >
      {/* HIDE INDEX */}
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="home"
        options={{
          title: "CORE",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size - 4} strokeWidth={2.5} />,
        }}
      />

      <Tabs.Screen
        name="createCourse"
        options={{
          title: "INIT",
          tabBarIcon: ({ color, size }) => (
            <PlusCircle color={color} size={size - 4} strokeWidth={2.5} />
          ),
        }}
      />

      <Tabs.Screen
        name="createRoadmap"
        options={{
          title: "PATH",
          tabBarIcon: ({ color, size }) => (
            <BookOpen color={color} size={size - 4} strokeWidth={2.5} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "LINK",
          tabBarIcon: ({ color, size }) => <User color={color} size={size - 4} strokeWidth={2.5} />,
        }}
      />
    </Tabs>
  );
}