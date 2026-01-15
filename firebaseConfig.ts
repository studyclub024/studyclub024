// src/firebaseConfig.ts

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBlOLDIGjDQxd6_j9Ps_sFws3y0al-OcgE",
  authDomain: "my-website-map-470209.firebaseapp.com",
  projectId: "my-website-map-470209",
  storageBucket: "my-website-map-470209.firebasestorage.app",
  messagingSenderId: "189767100910",
  appId: "1:189767100910:web:104ea1ffd4c75e508a06ff",
};

// Initialize Firebase using the compat API to resolve named export missing errors
const app = firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();

export const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});