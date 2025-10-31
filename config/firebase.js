// Import the functions from SDK
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1KGgDXPQKIBP_3gzgMPX6Qbd5btVCUuM",
  authDomain: "edutrack-cf80a.firebaseapp.com",
  projectId: "edutrack-cf80a",
  storageBucket: "edutrack-cf80a.firebasestorage.app",
  messagingSenderId: "966848789695",
  appId: "1:966848789695:web:8d2441d84a52d4463ada0a",
  measurementId: "G-RML71QWVGL"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
const analytics = getAnalytics(app);