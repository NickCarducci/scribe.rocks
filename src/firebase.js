import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Shared with the iOS app (project actuapedia-18ikj). Web API keys are
// public identifiers; access is enforced by Firestore rules.
const firebaseConfig = {
  apiKey: "AIzaSyBs-6gIyevm_usc5-j_sEMTBB7IVqC3esQ",
  authDomain: "actuapedia-18ikj.firebaseapp.com",
  projectId: "actuapedia-18ikj",
  storageBucket: "actuapedia-18ikj.firebasestorage.app",
  messagingSenderId: "751068077382",
  appId: "1:751068077382:web:08e6894f678b548494d947",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
