import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCdHrlg5jhREcWciYCXGDPDJJSg3L9czEI',
  authDomain: 'data-club-penguin.firebaseapp.com',
  projectId: 'data-club-penguin',
  storageBucket: 'data-club-penguin.firebasestorage.app',
  messagingSenderId: '160900919344',
  appId: '1:160900919344:web:d821e22645adc5fd42bdf5',
  measurementId: 'G-WJSQMGPM34',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
