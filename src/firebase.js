import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD0VEuyKH6NpZspFmvQfkCw2rfbhcxH4GQ",
  authDomain: "health-fact-game.firebaseapp.com",
  projectId: "health-fact-game",
  storageBucket: "health-fact-game.firebasestorage.app",
  messagingSenderId: "805551168031",
  appId: "1:805551168031:web:d0ff2b1101cfeb6308132a",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
