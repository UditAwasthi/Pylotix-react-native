import AsyncStorage from "@react-native-async-storage/async-storage";

const API = "https://st-v01.onrender.com";

const COURSE = "COURSE_";
const PROGRESS = "PROGRESS_";
const CERT = "CERT_";

/* =========================
SAVE COURSE LOCAL
========================= */

export async function saveCourse(course: any) {
  await AsyncStorage.setItem(COURSE + course._id, JSON.stringify(course));
}

/* =========================
GET COURSE LOCAL
========================= */

export async function getCourse(courseId: string) {
  const data = await AsyncStorage.getItem(COURSE + courseId);

  return data ? JSON.parse(data) : null;
}

/* =========================
SAVE PROGRESS (LOCAL + SERVER)
========================= */

export async function saveProgress(courseId: string, progress: any) {
  /* SAVE LOCAL */

  await AsyncStorage.setItem(PROGRESS + courseId, JSON.stringify(progress));

  /* SYNC SERVER */

  try {
    const token = await AsyncStorage.getItem("accessToken");

    await fetch(
      `${API}/progress/update`,

      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          courseId,

          chapterIndex: progress.chapterIndex,

          topicIndex: progress.topicIndex,
        }),
      },
    );
  } catch (e) {
    console.log("Progress sync failed");
  }
}

/* =========================
GET PROGRESS (SERVER FIRST)
========================= */

export async function getProgress(courseId: string) {
  try {
    const token = await AsyncStorage.getItem("accessToken");

    const res = await fetch(
      `${API}/progress/${courseId}`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await res.json();

    if (data?.progress) {
      /* SAVE LOCAL COPY */

      await AsyncStorage.setItem(
        PROGRESS + courseId,

        JSON.stringify(data.progress),
      );

      return data.progress;
    }
  } catch (e) {
    console.log("Server progress load failed");
  }

  /* FALLBACK LOCAL */

  const local = await AsyncStorage.getItem(PROGRESS + courseId);

  return local ? JSON.parse(local) : { chapterIndex: 0, topicIndex: 0 };
}

/* =========================
SAVE CERTIFICATE
========================= */

export async function saveCertificate(courseId: string) {
  await AsyncStorage.setItem(
    CERT + courseId,

    "true",
  );

  /* SYNC SERVER */

  try {
    const token = await AsyncStorage.getItem("accessToken");

    await fetch(
      `${API}/course/complete`,

      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          courseId,
        }),
      },
    );
  } catch (e) {
    console.log("Certificate sync failed");
  }
}

/* =========================
CHECK CERTIFICATE
========================= */

export async function hasCertificate(courseId: string) {
  const data = await AsyncStorage.getItem(CERT + courseId);

  return !!data;
}
