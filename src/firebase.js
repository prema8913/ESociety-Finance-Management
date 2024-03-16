// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database"; // Add this import for Realtime Database

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDN10QF-mQ1knp-WT0iqDaakkntmnjU8SE",
    authDomain: "virtusa-auth.firebaseapp.com",
    databaseURL: "https://virtusa-auth-default-rtdb.firebaseio.com",
    projectId: "virtusa-auth",
    storageBucket: "virtusa-auth.appspot.com",
    messagingSenderId: "431224930437",
    appId: "1:431224930437:web:65ad45551d61ed2cc2e9ec"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const database= getDatabase(app); // Initialize Realtime Database

export { db, auth, provider, database }; // Export Realtime Database along with other Firebase services
