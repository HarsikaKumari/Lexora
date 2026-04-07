// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// NOTE: Replace these placeholders with your actual Firebase project keys
const firebaseConfig = {
  apiKey: "AIzaSyBBJsJxy60P7GAelVnVafVz_fWumE0uZbw",
  authDomain: "lexora-fullstack.firebaseapp.com",
  projectId: "lexora-fullstack",
  storageBucket: "lexora-fullstack.firebasestorage.app",
  messagingSenderId: "810599372795",
  appId: "1:810599372795:web:f9f734c71984ba66e6dd5e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
