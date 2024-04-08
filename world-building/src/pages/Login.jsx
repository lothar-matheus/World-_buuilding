import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Welcome from './user/Welcome';

// Configurações do Firebase
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
    <div>
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