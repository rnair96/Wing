// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import {getReactNativePersistence} from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import Constants from 'expo-constants';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const {firebaseApiKey, firebaseAppId, firebaseProjectId, firebaseAuthDomain, firebaseMessagingSenderId, firebaseMeasurementId, firebaseStorageBucket} = Constants.expoConfig.extra

const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: firebaseAuthDomain,
  projectId: firebaseProjectId,
  storageBucket: firebaseStorageBucket,
  messagingSenderId: firebaseMessagingSenderId,
  appId: firebaseAppId,
  measurementId: firebaseMeasurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// const auth = getAuth();

// console.log("auth",auth)
const storage = getStorage(app);
const db = getFirestore();

export { auth, db, storage };