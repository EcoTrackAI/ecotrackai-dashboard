import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyClsDln-Zx961zC0f7X0-C2wJ9GCrwp46A",
  authDomain: "ecotrackai-7a140.firebaseapp.com",
  databaseURL:
    "https://ecotrackai-7a140-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ecotrackai-7a140",
  storageBucket: "ecotrackai-7a140.firebasestorage.app",
  messagingSenderId: "307182555730",
  appId: "1:307182555730:web:a137c7a1ef5a427d80058b",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
