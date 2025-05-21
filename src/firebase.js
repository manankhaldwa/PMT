import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZWWK9AxA-sXCisNLrtc-wZkac_3ibCRo",
  authDomain: "project-management-tool-30cd0.firebaseapp.com",
  projectId: "project-management-tool-30cd0",
  storageBucket: "project-management-tool-30cd0.appspot.com",
  messagingSenderId: "1052213434296",
  appId: "1:1052213434296:web:8b86c9bb481bc3bfcd214d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
