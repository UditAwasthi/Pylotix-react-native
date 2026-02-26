import AsyncStorage from "@react-native-async-storage/async-storage";

const API = "https://st-v01.onrender.com";

/* =========================================
   UPDATE COURSE PROGRESS
   POST /progress/update
========================================= */

export async function syncProgress(
  courseId: string,
  chapterIndex: number,
  topicIndex: number,
) {
  try {
    const token = await AsyncStorage.getItem("accessToken");

    await fetch(`${API}/progress/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        courseId,
        chapterIndex,
        topicIndex,
      }),
    });
  } catch (e) {
    console.log("syncProgress failed", e);
  }
}

/* =========================================
   GET COURSE PROGRESS
   GET /progress/:courseId
========================================= */

export async function fetchServerProgress(courseId: string) {
  try {
    const token = await AsyncStorage.getItem("accessToken");

    const res = await fetch(`${API}/progress/${courseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    return data;
  } catch (e) {
    console.log("fetchServerProgress failed", e);
    return null;
  }
}

/* =========================================
   SUBMIT QUIZ RESULT
   POST /topic-progress/quiz/submit
========================================= */

export async function syncQuiz(
  courseId: string,
  chapterIndex: number,
  topicIndex: number,
  correctCount: number,
  attemptedCount: number,
  passed: boolean,
) {
  try {
    const token = await AsyncStorage.getItem("accessToken");

    await fetch(`${API}/topic-progress/quiz/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        courseId,
        chapterIndex,
        topicIndex,
        correctCount,
        attemptedCount,
        passed,
      }),
    });
  } catch (e) {
    console.log("syncQuiz failed", e);
  }
}

/* =========================================
   COMPLETE COURSE
   POST /course/complete
========================================= */

export async function syncComplete(courseId: string) {
  try {
    const token = await AsyncStorage.getItem("accessToken");

    await fetch(`${API}/course/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        courseId,
      }),
    });
  } catch (e) {
    console.log("syncComplete failed", e);
  }
}
