// Firebase client SDK setup
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA6CjIdsIRdjA4gvMtF1aC5pjPYexraeKg",
  authDomain: "resume-67e0d.firebaseapp.com",
  projectId: "resume-67e0d",
  storageBucket: "resume-67e0d.appspot.com",
  messagingSenderId: "783354201630",
  appId: "1:783354201630:web:858ac0930697d8af3b100f",
  measurementId: "G-PZN2SFFSVR"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const storage = getStorage(app);
