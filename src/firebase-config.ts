import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_API_KEY,
  authDomain: "vcontact-fdd62.firebaseapp.com",
  projectId: "vcontact-fdd62",
  storageBucket: "vcontact-fdd62.appspot.com",
  messagingSenderId: "937411543463",
  appId: "1:937411543463:web:5b787e7320c78c6df27682",
  measurementId: "G-WYFSRDJF3E",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);
