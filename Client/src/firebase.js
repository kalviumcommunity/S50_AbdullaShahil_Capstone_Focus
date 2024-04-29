import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyB8fvkK6mbSNI2d_ETLiDcPrj18IKkSlQ4",
  authDomain: "focus-8b1e0.firebaseapp.com",
  projectId: "focus-8b1e0",
  storageBucket: "focus-8b1e0.appspot.com",
  messagingSenderId: "899923248625",
  appId: "1:899923248625:web:46e90ebc2033aed5f93050",
  measurementId: "G-XPPG2J0160"
};

const app = initializeApp(firebaseConfig);
const ImageDB = getStorage(app)
const analytics = getAnalytics(app);

export {ImageDB};