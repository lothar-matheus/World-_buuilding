import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';



// configurações do firebase
const firebaseConfig = {
  apiKey: "AIzaSyB81OkcBZrWGfqW2BPpgbnLjUP_hwPH0Oc",
  authDomain: "world-building-6b582.firebaseapp.com",
  projectId: "world-building-6b582",
  storageBucket: "world-building-6b582.appspot.com",
  messagingSenderId: "752971778873",
  appId: "1:752971778873:web:a6f6b6e1e1b33b270f36e8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();

function criarUserLogar(email, passWord) {
  createUserWithEmailAndPassword(auth, email, passWord)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
    });
}




function Create() {
  const [email, setEmail] = useState("");
  const [passWord, setPassword] = useState("");


  //function logarCom Google
function logarComGoogle(){
    signInWithPopup(auth, provider).then((result)=>{
        const credential = GoogleAuthProvider.credentialFromResult(result)
        const token = credential.accessToken;
        const user = result.user;

        console.log(token);
        console.log(user)
    }).catch((error)=>{
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error)



    });
}

  return (
    <div>
      <input
        type="email"
        placeholder="Digite seu e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Digite sua senha"
        value={passWord}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={() => criarUserLogar(email, passWord)}>Vamos ingressar!</button>
      <button onClick={logarComGoogle}>Login com Google</button>      
    </div>
  );
}

export default Create;
