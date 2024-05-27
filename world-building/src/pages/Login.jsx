import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Welcome from './user/Welcome';
import '../App.jsx';
import '../App.css';
import firebaseAppAuth from '../firebaseAuth.js';

// Configurações do Firebase


//const app = initializeApp(firebaseAppAuth);
//const auth = getAuth(app);
const auth = getAuth(firebaseAppAuth);

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // O usuário está logado
        const user = userCredential.user;
        console.log('Usuário logado:', user);
        setIsLoggedIn(true);
      })
      .catch((error) => {
        // Ocorreu um erro durante o login
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('Erro durante o login:', errorMessage);
        // Você pode exibir uma mensagem de erro para o usuário
      });
  };

  if (isLoggedIn) {
    return <Welcome email={email} />;
  }

  return (
    <div className='divLogin'>
      <h1>Login</h1>
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
      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
}

export default Login;