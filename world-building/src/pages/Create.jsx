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
    // Expressão regular para validar a força da senha
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
  
    // Verifica se a senha atende aos requisitos
    if (!passwordRegex.test(password)) {
      alert('A senha deve conter pelo menos uma letra minúscula, uma letra maiúscula e um número.');
      return;
    }
  
    // Verifica se as senhas coincidem
    if (password !== confirmPassword) {
      alert('As senhas não coincidem. Por favor, tente novamente.');
      return;
    }
  
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
      alert('Conta criada com sucesso!');
      navigate('/login');
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      // Verifica se o erro é devido ao e-mail já estar em uso
      if (errorCode === 'auth/email-already-in-use') {
        console.log('E-mail já cadastrado. Tente novamente com um e-mail diferente.');
        return; // Retorna sem exibir o alerta de erro
      }

      console.log(errorMessage);
      alert('Erro ao criar conta: ' + errorMessage);
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
    </div>
  );
}

export default Create;