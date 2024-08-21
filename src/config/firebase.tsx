import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
const firebaseConfig = {
  apiKey: "secret",
  authDomain: "finalprod-6d809.firebaseapp.com",
  projectId: "finalprod-6d809",
  storageBucket: "finalprod-6d809.appspot.com",
  messagingSenderId: "secret",
  appId: "secret"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export {
    auth,
    db,
}