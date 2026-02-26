import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { router } from "expo-router";

import Svg, { Circle } from "react-native-svg";

const API = "https://st-v01.onrender.com";

const SIZE = 100;
const STROKE = 8;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const token = await AsyncStorage.getItem("accessToken");

      const res = await fetch(`${API}/profile/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setProfile(data);
    } catch (e) {
      console.log(e);
    }

    setLoading(false);
  }

  function accuracy(tp: any) {
    let correct = 0;

    let attempted = 0;

    Object.values(tp || {}).forEach((x: any) => {
      correct += x.correctCount || 0;

      attempted += x.attemptedCount || 0;
    });

    return attempted ? Math.round((correct / attempted) * 100) : 0;
  }

  function ProgressRing({
    percent,
    color,
  }: {
    percent: number;
    color: string;
  }) {
    const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;

    return (
      <View style={{ alignItems: "center" }}>
        <Svg width={SIZE} height={SIZE}>
          <Circle
            stroke="#eee"
            fill="none"
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            strokeWidth={STROKE}
          />

          <Circle
            stroke={color}
            fill="none"
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            strokeWidth={STROKE}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${SIZE / 2}, ${SIZE / 2}`}
          />
        </Svg>

        <Text style={styles.ringText}>{percent}%</Text>
      </View>
    );
  }

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );

  const { user, stats, courses } = profile;

  const avgAcc = courses.length
    ? Math.round(
        courses.reduce(
          (a: number, c: any) => a + accuracy(c.topicProgress),
          0,
        ) / courses.length,
      )
    : 0;

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}

      <View style={styles.header}>
        <Image
          source={{
            uri: user.avatar || "https://i.pravatar.cc/300",
          }}
          style={styles.avatar}
        />

        <Text style={styles.name}>{user.name}</Text>

        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* RINGS */}

      <View style={styles.ringRow}>
        <View>
          <Text style={styles.label}>Streak</Text>

          <ProgressRing percent={stats.streak || 0} color="#FF5733" />
        </View>

        <View>
          <Text style={styles.label}>Mastery</Text>

          <ProgressRing percent={avgAcc} color="#000" />
        </View>
      </View>

      {/* STATS */}

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{courses.length}</Text>

          <Text style={styles.statLabel}>Courses</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{avgAcc}%</Text>

          <Text style={styles.statLabel}>Accuracy</Text>
        </View>
      </View>

      {/* COURSES */}

      <Text style={styles.section}>Your Courses</Text>

      {courses.map((c: any) => {
        const acc = accuracy(c.topicProgress);

        return (
          <View key={c.courseId} style={styles.courseCard}>
            <Text style={styles.courseTitle}>{c.title}</Text>

            <View style={styles.progressBar}>
              <View
                style={{
                  backgroundColor: "black",
                  height: 6,
                  width: `${acc}%`,
                }}
              />
            </View>

            <Text>{acc}%</Text>
          </View>
        );
      })}

      {/* LOGOUT */}

      <TouchableOpacity
        style={styles.logout}
        onPress={async () => {
          await AsyncStorage.removeItem("accessToken");

          router.replace("/");
        }}
      >
        <Text style={{ color: "white" }}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    alignItems: "center",
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },

  email: {
    color: "gray",
  },

  ringRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 30,
  },

  label: {
    textAlign: "center",
    marginBottom: 10,
  },

  ringText: {
    position: "absolute",
    top: 40,
    alignSelf: "center",
    fontWeight: "bold",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },

  statCard: {
    alignItems: "center",
  },

  statValue: {
    fontSize: 22,
    fontWeight: "bold",
  },

  statLabel: {
    color: "gray",
  },

  section: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 20,
  },

  courseCard: {
    marginBottom: 15,
  },

  courseTitle: {
    fontWeight: "bold",
  },

  progressBar: {
    height: 6,
    backgroundColor: "#eee",
    marginVertical: 5,
  },

  logout: {
    backgroundColor: "red",
    padding: 15,
    marginTop: 30,
    alignItems: "center",
    borderRadius: 10,
  },
});
