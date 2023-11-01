// Connecting Firebase with React App
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPbhTXo-duecdp2-YHqKU0ddj7P30L1A4",
  authDomain: "linkedin-clone-77ffc.firebaseapp.com",
  projectId: "linkedin-clone-77ffc",
  storageBucket: "linkedin-clone-77ffc.appspot.com",
  messagingSenderId: "1093986724805",
  appId: "1:1093986724805:web:1a0ad2f75e4c51629ef9ac",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
const provider = new GoogleAuthProvider();

// const docRef = doc(db, "UserInfo", "Zfv8IJZPIdYC7OmImuCg");
// const docSnap = await getDoc(docRef);
// console.log("in firebase config", docSnap.data());

export { auth, db, storage, provider };
