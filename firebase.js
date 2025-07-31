import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDTG_WPBfUMD1588-KyF8S7R6DzINq1ZBs",
  authDomain: "mithracareers-c3350.firebaseapp.com",
  projectId: "mithracareers-c3350",
  storageBucket: "mithracareers-c3350.appspot.com",  // ✅ fixed here
  messagingSenderId: "240951832865",
  appId: "1:240951832865:web:49691a8f4fe58313f40e60",
  measurementId: "G-29V6T9KMD5"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
