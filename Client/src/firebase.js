import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import firebaseConfigData from "../env";

const firebaseConfig= {
  apiKey: firebaseConfigData.FIREBASE_API_KEY,
  authDomain: firebaseConfigData.FIREBASE_AUTH_DOMAIN,
  projectId: firebaseConfigData.FIREBASE_PROJECT_ID,
  storageBucket: firebaseConfigData.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: firebaseConfigData.FIREBASE_MESSAGING_SENDER_ID,
  appId: firebaseConfigData.FIREBASE_APP_ID,
  measurementId: firebaseConfigData.FIREBASE_MEASUREMENT_ID
};


const app = initializeApp(firebaseConfig);
const ImageDB = getStorage(app);
const analytics = getAnalytics(app);

export { ImageDB };
