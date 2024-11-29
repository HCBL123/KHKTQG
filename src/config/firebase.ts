import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // Replace with your Firebase config

  apiKey: "AIzaSyDRsHcfxc8ZZsA9O83W2b1pXlXfaqbOXZk",

  authDomain: "rehabilitation-assistant-b4c4d.firebaseapp.com",

  projectId: "rehabilitation-assistant-b4c4d",

  storageBucket: "rehabilitation-assistant-b4c4d.firebasestorage.app",

  messagingSenderId: "652441587676",

  appId: "1:652441587676:web:7c313b8e0eb4627bdf0919"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
