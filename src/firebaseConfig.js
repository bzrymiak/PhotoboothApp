import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD5NcIU4dgTcqAZiTtygiQqZqnKNwOd8XY",
  authDomain: "iat359-photoboothapp.firebaseapp.com",
  projectId: "iat359-photoboothapp",
  storageBucket: "iat359-photoboothapp.firebasestorage.app",
  messagingSenderId: "495405279023",
  appId: "1:495405279023:web:145e95864823f126e4a3da",
  measurementId: "G-NF63K7W7WB",
};

export const firebase_app = initializeApp(firebaseConfig);
export const firebase_auth = getAuth(firebase_app);
export const firebase_storage = getStorage(firebase_app);
export const firebase_db = getFirestore(firebase_app);
