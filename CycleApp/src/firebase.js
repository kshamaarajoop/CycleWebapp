import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDxbBQYP19e-tHCOTp8sqKVJiXyasTA-HU",
  authDomain: "cycleweb-95039.firebaseapp.com",
  projectId: "cycleweb-95039",
  storageBucket: "cycleweb-95039.firebasestorage.app",
  messagingSenderId: "194076594891",
  appId: "1:194076594891:web:0b822ba0c5a81fafff014e",
   measurementId: "G-EH692PM082"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider(); 

export { auth, googleProvider };
