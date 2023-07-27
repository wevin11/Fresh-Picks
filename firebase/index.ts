// import the functions you need from the SDKs you need
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth/react-native";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "APIKEY",
//   authDomain: "DOMAIN",
//   projectId: "PROJECTID",
//   storageBucket: "STORAGEBUCKET",
//   messagingSenderId: "SENDERID",
//   appId: "APPID",
//   measurementId: "MEASUREMENTID"
// };


// Initialize Firebase
const app = initializeApp(firebaseConfig);

initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const RecaptchaVerifier = auth.RecaptchaVerifier;

export { RecaptchaVerifier, analytics, app, auth, db, firebaseConfig, storage };

