import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBs0QNsJu_dGMY-2K3YoYBrCdVytgYY68o",
  authDomain: "research-to-commercialization.firebaseapp.com",
  projectId: "research-to-commercialization",
  storageBucket: "research-to-commercialization.firebasestorage.app",
  messagingSenderId: "732981995220",
  appId: "1:732981995220:web:fb17ce2f8da15f91343d41",
  measurementId: "G-9SDGNPW8RC"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();


export { auth, googleProvider };