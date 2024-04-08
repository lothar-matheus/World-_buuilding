import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Create from './pages/Create';
import Login from './pages/Login'; // Importe o componente Login

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/create" element={<Create />} />
          <Route path="/login" element={<Login />} /> {/* Nova rota para o componente Login */}
          <Route
            path="/"
            element={
              <>
                <h1>Welcome to World Building!</h1>
                <p>A system to help writers, RPG masters, or anyone interested in creating a fictional world.</p>
                <Link to="/create">
                  <button className='comeceAgora'>Get Started Now!</button>
                </Link>
                <Link to="/login">
                  <button>Login</button>
                </Link> {/* Adicione um botão para navegar para a tela de login */}
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;