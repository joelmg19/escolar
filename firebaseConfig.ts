import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth/react-native';

const firebaseConfig = {
  apiKey: "AIzaSyCDLfOC8WG1JBKUXYTNLgX7BYrweC6MP3A",
  projectId: "furgonescolar-e41e8",
  storageBucket: "furgonescolar-e41e8.firebasestorage.app",
  messagingSenderId: "160554863054",
  appId: "1:160554863054:android:225973d8bd44fb34d6039f",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
