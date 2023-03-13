// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQM8bDhjRzZiPYmHSHWRM0DQ2J4oEzDN0",
  authDomain: "mission-partner-app.firebaseapp.com",
  projectId: "mission-partner-app",
  storageBucket: "mission-partner-app.appspot.com",
  messagingSenderId: "597753804912",
  appId: "1:597753804912:web:4d56fdbf0b769d55975cb5",
  measurementId: "G-P3G9DE9FWP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const storage = getStorage(app);
const db = getFirestore();


export { auth, db, storage };