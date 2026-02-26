import AsyncStorage from "@react-native-async-storage/async-storage";

const API = "https://st-v01.onrender.com";

const SYNC_QUEUE = "SYNC_QUEUE";

let isSyncing = false;

/* ========================
ADD TO QUEUE
======================== */

export async function addToSyncQueue(item: any) {
  const queueRaw = await AsyncStorage.getItem(SYNC_QUEUE);

  const queue = queueRaw ? JSON.parse(queueRaw) : [];

  queue.push({
    ...item,
    id: Date.now(),
    retry: 0,
  });

  await AsyncStorage.setItem(SYNC_QUEUE, JSON.stringify(queue));

  runSync();
}

/* ========================
MAIN SYNC WORKER
======================== */

export async function runSync() {
  if (isSyncing) return;

  isSyncing = true;

  try {
    const token = await AsyncStorage.getItem("accessToken");

    if (!token) return;

    let queueRaw = await AsyncStorage.getItem(SYNC_QUEUE);

    if (!queueRaw) return;

    let queue = JSON.parse(queueRaw);

    let newQueue = [];

    for (let item of queue) {
      try {
        await syncItem(item, token);
      } catch (e) {
        item.retry++;

        if (item.retry < 5) newQueue.push(item);
      }
    }

    await AsyncStorage.setItem(SYNC_QUEUE, JSON.stringify(newQueue));
  } finally {
    isSyncing = false;
  }
}

/* ========================
SYNC ITEM TYPE HANDLER
======================== */

async function syncItem(item: any, token: string) {
  switch (item.type) {
    case "progress":
      await fetch(`${API}/progress/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(item.data),
      });

      break;

    case "certificate":
      await fetch(`${API}/course/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(item.data),
      });

      break;
  }
}

/* ========================
AUTO SYNC EVERY 15 SEC
======================== */

setInterval(runSync, 15000);
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
