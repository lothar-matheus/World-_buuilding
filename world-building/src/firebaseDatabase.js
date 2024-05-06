import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfigDatabase = {
  apiKey: "AIzaSyB81OkcBZrWGfqW2BPpgbnLjUP_hwPH0Oc",
  authDomain: "world-building-6b582.firebaseapp.com",
  databaseURL: "https://world-building-6b582-default-rtdb.firebaseio.com",
  projectId: "world-building-6b582",
  storageBucket: "world-building-6b582.appspot.com",
  messagingSenderId: "752971778873",
  appId: "1:752971778873:web:5d960848cff2eb780f36e8"
};

const firebaseAppDatabase = initializeApp(firebaseConfigDatabase, 'database');
const database = getDatabase(firebaseAppDatabase);

export { database };