import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import '../App.css';
import firebaseAppAuth from '../firebaseAuth';

const auth = getAuth(firebaseAppAuth);
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
