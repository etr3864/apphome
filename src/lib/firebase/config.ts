import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDtqc5tXeeFz0ogXcz8szL17IPCBWRoux0",
  authDomain: "apphouse-e4914.firebaseapp.com",
  projectId: "apphouse-e4914",
  storageBucket: "apphouse-e4914.firebasestorage.app",
  messagingSenderId: "1043544718844",
  appId: "1:1043544718844:web:a1ba9f1d890a0a012ac679",
  measurementId: "G-M6PK1ZYZBW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

