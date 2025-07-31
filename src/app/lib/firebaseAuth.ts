import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  updateProfile,
  User,
} from "firebase/auth";

export function registerWithEmail(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logoutFirebase() {
  return signOut(auth);
}

export function onUserChanged(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, cb);
}

export function sendVerificationEmail(user: User) {
  return sendEmailVerification(user);
}

export function setupRecaptcha(containerId: string) {
  return new RecaptchaVerifier(auth, containerId, { size: "invisible" });
}

export function loginWithPhone(phone: string, appVerifier: RecaptchaVerifier) {
  return signInWithPhoneNumber(auth, phone, appVerifier);
}

export function updateFirebaseProfile(user: User, data: { displayName?: string; photoURL?: string }) {
  return updateProfile(user, data);
}
