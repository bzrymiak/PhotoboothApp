import { initializeApp } from "firebase/app"; // import Firebase Authentication functionality into your project.
import { getAuth } from "firebase/auth"; // Your web app's Firebase configuration

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
// Exports the Firebase Authentication instance to be used in other parts of your project.
export const firebase_auth = getAuth(firebase_app);
