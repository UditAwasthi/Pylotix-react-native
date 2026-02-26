import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export const API_BASE = "https://st-v01.onrender.com";


/*
===========================================
CORE AUTH FETCH
===========================================
*/

export async function authFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  try {

    const token = await AsyncStorage.getItem("accessToken");

    if (!token) {

      await AsyncStorage.removeItem("accessToken");

      router.replace("/auth/WelcomeScreen");

      throw new Error("No token found");

    }

    const url =
      endpoint.startsWith("http")
        ? endpoint
        : `${API_BASE}${endpoint}`;


    const response = await fetch(url, {

      ...options,

      headers: {

        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`,

        ...(options.headers || {}),

      },

    });


    /*
    ===========================================
    AUTO LOGOUT ON TOKEN EXPIRE
    ===========================================
    */

    if (response.status === 401) {

      await AsyncStorage.removeItem("accessToken");

      router.replace("/auth/WelcomeScreen");

      throw new Error("Session expired");

    }


    return response;

  }

  catch (error) {

    console.log("API ERROR:", error);

    throw error;

  }
}



/*
===========================================
GENERIC HELPERS
===========================================
*/


export async function getJSON(endpoint: string) {

  const res = await authFetch(endpoint);

  return res.json();

}


export async function postJSON(
  endpoint: string,
  body: any
) {

  const res = await authFetch(endpoint, {

    method: "POST",

    body: JSON.stringify(body),

  });

  return res.json();

}


export async function putJSON(
  endpoint: string,
  body: any
) {

  const res = await authFetch(endpoint, {

    method: "PUT",

    body: JSON.stringify(body),

  });

  return res.json();

}



/*
===========================================
LOGOUT
===========================================
*/

export async function logout() {

  await AsyncStorage.removeItem("accessToken");

  router.replace("/auth/WelcomeScreen");

}





export function generateCourse(topicName: string) {

  return postJSON("/content", { topicName });

}


export function getAllCourses(existingCourseIds: string[] = []) {

  return postJSON("/content/getAllCourses", {

    existingCourseIds,

  });

}


export function getCourse(courseId: string) {

  return getJSON(`/content/${courseId}`);

}




// # ===========================================
// # PROGRESS API
// # ===========================================


export function getProgress(courseId: string) {

  return getJSON(`/progress/${courseId}`);

}


export function updateProgress(data: {

  courseId: string;

  chapterIndex: number;

  topicIndex: number;

}) {

  return postJSON("/progress/update", data);

}




// # ===========================================
// # QUIZ API
// # ===========================================


export function submitQuiz(data: {

  courseId: string;

  chapterIndex: number;

  topicIndex: number;

  questionIndex: number;

  selectedOptionIndex: number;

  correctOptionIndex: number;

}) {

  return postJSON("/topic-progress/quiz/submit", data);

}



export function isUnlocked(params: {

  courseId: string;

  chapterIndex: number;

  topicIndex: number;

}) {

  return getJSON(

    `/topic-progress/unlock?courseId=${params.courseId}&chapterIndex=${params.chapterIndex}&topicIndex=${params.topicIndex}`

  );

}




// # ===========================================
// # COURSE COMPLETION
// # ===========================================


export function completeCourse(courseId: string) {

  return postJSON("/course/complete", {

    courseId,

  });

}