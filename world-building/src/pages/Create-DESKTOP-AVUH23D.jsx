import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import firebaseAppAuth from '../firebaseAuth';


const auth = getAuth(firebaseAppAuth);
const provider = new GoogleAuthProvider();

function Create() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

function criarUserLogar(email, password, confirmPassword) {
  if (password !== confirmPassword) {
    alert('As senhas não coincidem. Por favor, tente novamente.');
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
      alert('Conta criada com sucesso!');
      navigate('/login')
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      alert('Erro ao criar conta: ' + errorMessage);
    });
}

function logarComGoogle() {
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      console.log(token);
      console.log(user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
    });
}



  return (
    <div className='divLogin'>
      <input
        type="email"
        placeholder="Digite seu e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Digite sua senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirme sua senha"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={() => criarUserLogar(email, password, confirmPassword)}>
        Vamos ingressar!
      </button>
      <button onClick={logarComGoogle}>Login com Google</button>
    </div>
  );
}

export default Create;