// config/firebase.js
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics"; // Disabled to stop warnings
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyC1KGgDXPQKIBP_3gzgMPX6Qbd5btVCUuM",
  authDomain: "edutrack-cf80a.firebaseapp.com",
  projectId: "edutrack-cf80a",
  storageBucket: "edutrack-cf80a.firebasestorage.app",
  messagingSenderId: "966848789695",
  appId: "1:966848789695:web:8d2441d84a52d4463ada0a",
  measurementId: "G-RML71QWVGL"
};

// 1. Initialize App
export const app = initializeApp(firebaseConfig);

// 2. Initialize Auth (With Memory Fix)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// 3. Exports
export const firestore = getFirestore(app);
export const storage = getStorage(app);