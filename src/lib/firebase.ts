import { initializeApp } from "firebase/app";
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentSingleTabManager 
} from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB8rq4TflFIB32Yapw2An9IaBea0CvYZCo",
  authDomain: "cafemaster-29ad6.firebaseapp.com",
  projectId: "cafemaster-29ad6",
  storageBucket: "cafemaster-29ad6.firebasestorage.app",
  messagingSenderId: "922511153278",
  appId: "1:922511153278:web:09112f3735fb38a509202f"
};

const app = initializeApp(firebaseConfig);

// Using the modern cache settings to resolve deprecation warning
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentSingleTabManager({})
  })
});

export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, provider);
export const logout = () => signOut(auth);
