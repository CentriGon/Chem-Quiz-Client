// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAI2q3RMMb4qSMxg0XcurMMfG4ZWHGhcjg",
  authDomain: "chem-quiz-cf129.firebaseapp.com",
  projectId: "chem-quiz-cf129",
  storageBucket: "chem-quiz-cf129.appspot.com",
  messagingSenderId: "472549417968",
  appId: "1:472549417968:web:01a4757110b151a35df335",
  measurementId: "G-09016ZPDMR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(app)