import { initializeApp } from 'firebase/app';
const firebaseConfigAuth = {
    apiKey: "AIzaSyB81OkcBZrWGfqW2BPpgbnLjUP_hwPH0Oc",
    authDomain: "world-building-6b582.firebaseapp.com",
    projectId: "world-building-6b582",
    storageBucket: "world-building-6b582.appspot.com",
    messagingSenderId: "752971778873",
    appId: "1:752971778873:web:a6f6b6e1e1b33b270f36e8"
};

const firebaseAppAuth = initializeApp(firebaseConfigAuth);


export default firebaseAppAuth;