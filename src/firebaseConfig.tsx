// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getAuth } from "firebase/auth";
import { getMessaging } from 'firebase/messaging';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAu1KjfYC1Je0MKgaRZgpSuQGXw-_zcEoc",
  authDomain: "projeto-testes-6b863.firebaseapp.com",
  databaseURL: "https://projeto-testes-6b863-default-rtdb.firebaseio.com",
  projectId: "projeto-testes-6b863",
  storageBucket: "projeto-testes-6b863.appspot.com",
  messagingSenderId: "361777768271",
  appId: "1:361777768271:web:8b7c7107a115dd75d3873a",
  measurementId: "G-M1QBWZHTKY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getDatabase(app);
const storage = getStorage(app);
const auth = getAuth(app)
const messaging = getMessaging(app);
const analytics = getAnalytics(app);

export { db, storage, auth, messaging, analytics};